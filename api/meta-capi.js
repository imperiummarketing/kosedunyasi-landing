const EVENT_NAME = "Contact";

function parseBody(request) {
  if (!request.body) return {};
  if (typeof request.body === "string") return JSON.parse(request.body);
  return request.body;
}

function firstHeaderValue(value) {
  if (!value) return "";
  return String(value).split(",")[0].trim();
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    const testEventCode = process.env.META_TEST_EVENT_CODE || "";
    const allowedOrigin = process.env.META_ALLOWED_ORIGIN || "https://magazamiz.kosedunyasi.com";
    const graphApiVersion = process.env.META_GRAPH_API_VERSION || "v25.0";

    if (!pixelId || !accessToken) {
      console.error("[Meta CAPI] Missing environment variables");
      return response.status(500).json({ ok: false, error: "Server configuration error" });
    }

    const requestOrigin = request.headers.origin || "";
    if (requestOrigin !== allowedOrigin) {
      return response.status(403).json({ ok: false, error: "Origin not allowed" });
    }

    const body = parseBody(request);
    const { event_id: eventId, event_source_url: eventSourceUrl, event_time: suppliedEventTime, fbp, fbc } = body;

    if (typeof eventId !== "string" || eventId.length < 8 || eventId.length > 200) {
      return response.status(400).json({ ok: false, error: "Invalid event_id" });
    }

    if (typeof eventSourceUrl !== "string") {
      return response.status(400).json({ ok: false, error: "Invalid event_source_url" });
    }

    let parsedSourceUrl;
    try { parsedSourceUrl = new URL(eventSourceUrl); } catch {
      return response.status(400).json({ ok: false, error: "Malformed event_source_url" });
    }

    if (parsedSourceUrl.hostname !== "magazamiz.kosedunyasi.com") {
      return response.status(400).json({ ok: false, error: "Invalid event source hostname" });
    }

    const clientIpAddress = firstHeaderValue(request.headers["x-forwarded-for"]) || firstHeaderValue(request.headers["x-real-ip"]);
    const clientUserAgent = request.headers["user-agent"] || "";

    const userData = {};
    if (clientIpAddress) userData.client_ip_address = clientIpAddress;
    if (clientUserAgent) userData.client_user_agent = clientUserAgent;
    if (typeof fbp === "string" && fbp.length > 0) userData.fbp = fbp;
    if (typeof fbc === "string" && fbc.length > 0) userData.fbc = fbc;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const eventTime = Number.isInteger(suppliedEventTime) && suppliedEventTime > 0 ? suppliedEventTime : currentTimestamp;

    const metaPayload = {
      data: [{
        event_name: EVENT_NAME,
        event_time: eventTime,
        event_id: eventId,
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data: userData,
        custom_data: {
          contact_channel: "whatsapp",
          cta_name: "whatsapp_bilgi_al",
          site_area: "magazamiz_landing",
        },
      }],
    };

    if (testEventCode) metaPayload.test_event_code = testEventCode;

    const endpoint = `https://graph.facebook.com/${encodeURIComponent(graphApiVersion)}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`;

    const metaResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metaPayload),
    });

    const metaResult = await metaResponse.json();

    if (!metaResponse.ok) {
      console.error("[Meta CAPI] Meta API error:", metaResult);
      return response.status(502).json({ ok: false, error: "Meta API request failed", meta_error: metaResult?.error?.message || null });
    }

    return response.status(200).json({
      ok: true,
      event_name: EVENT_NAME,
      event_id: eventId,
      events_received: metaResult.events_received ?? null,
      fbtrace_id: metaResult.fbtrace_id ?? null,
    });
  } catch (error) {
    console.error("[Meta CAPI] Unexpected error:", error);
    return response.status(500).json({ ok: false, error: "Unexpected server error" });
  }
}
