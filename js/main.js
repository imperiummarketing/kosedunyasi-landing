(function(){
  var stage=document.getElementById('stage');
  var qs=new URLSearchParams(location.search);
  var STATIC=qs.has('static');
  var CAL=qs.has('calib');
  var PHONE='905357830014'; // 0535 783 00 14
  var WA_TEXT='Merhabalar, köşe koltuk mobilyalarınız hakkında detaylı bilgi alabilir miyim?';
  document.getElementById('whatsapp-info-cta').href='https://wa.me/'+PHONE+'?text='+encodeURIComponent(WA_TEXT);
  var callEl=document.getElementById('call');if(callEl)callEl.href='tel:+'+PHONE;
  if(CAL||STATIC) document.getElementById('dock').style.display='none';

  // ---- Dönüşüm takibi (canlı siteyle birebir aynı olay yapısı; GTM tetikleyicileri bunu dinler) ----
  window.dataLayer=window.dataLayer||[];
  function eventId(){ return (window.crypto&&crypto.randomUUID)?crypto.randomUUID():['wa',Date.now(),Math.random().toString(36).slice(2,12)].join('_'); }
  function getCookie(n){ var p=encodeURIComponent(n)+'='; var a=document.cookie.split(';'); for(var i=0;i<a.length;i++){ var c=a[i].trim(); if(c.indexOf(p)===0) return decodeURIComponent(c.slice(p.length)); } return ''; }
  function getFbc(){ var e=getCookie('_fbc'); if(e) return e; var id=new URLSearchParams(location.search).get('fbclid'); return id?('fb.1.'+Date.now()+'.'+id):''; }
  function metaCapi(id,time){ // sunucu tarafı Meta olayı (canlı sitedeki /api/meta-capi ile aynı)
    try{ fetch('/api/meta-capi',{method:'POST',headers:{'Content-Type':'application/json'},keepalive:true,
      body:JSON.stringify({event_id:id,event_time:time,event_source_url:location.href,fbp:getCookie('_fbp'),fbc:getFbc()})}).catch(function(){}); }catch(e){}
  }
  var lastWa=0;
  document.getElementById('whatsapp-info-cta').addEventListener('click',function(){
    var now=Date.now(); if(now-lastWa<1500) return; lastWa=now;
    var id=eventId();
    window.dataLayer.push({event:'whatsapp_click',event_id:id,contact_channel:'whatsapp',cta_name:'whatsapp_bilgi_al',site_area:'magazamiz_landing'});
    metaCapi(id,Math.floor(now/1000));
  },{capture:true});
  function fit(){
    var w=document.documentElement.clientWidth||innerWidth;
    var s=CAL?1:Math.min(w,720)/1080;
    document.documentElement.style.setProperty('--s',s);
  }
  fit(); addEventListener('resize',fit);

  // Sağ / Sol köşe seçimi (başlangıçta seçim yok: görselle birebir)
  var lr=document.getElementById('lr'), rot=document.getElementById('rot'), deg=0, side=null;
  var picks=[].slice.call(lr.querySelectorAll('.pick'));
  function select(s){
    side=s; deg+=180; rot.style.transform='rotate('+deg+'deg)';
    lr.classList.toggle('sl',s==='l'); lr.classList.toggle('sr',s==='r');
    picks.forEach(function(p){ p.classList.toggle('on',p.dataset.side===s); });
  }
  function toggle(){ select(side==='l'?'r':'l'); }
  picks.forEach(function(p){ p.addEventListener('click',function(){ select(p.dataset.side); }); });
  rot.addEventListener('click',toggle);
  rot.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();} });
  rot.setAttribute('tabindex','0');

  if(STATIC) return;
  // Giriş animasyonu: yukarıdan aşağı sırayla
  document.documentElement.classList.add('anim');
  var fonts=document.fonts?document.fonts.ready:Promise.resolve();
  function reveal(st){
    if(st.dataset.done) return; st.dataset.done=1;
    var els=[].slice.call(st.querySelectorAll('[data-in]'));
    els.sort(function(a,b){ return a.getBoundingClientRect().top-b.getBoundingClientRect().top; });
    var step=Math.max(18,Math.min(55,1400/els.length));
    els.forEach(function(el,i){ setTimeout(function(){ el.classList.add('on'); },80+i*step); });
    st.classList.add('live');
    if(st===stage) setTimeout(function(){ var l=stage.querySelector('.logo'); l&&l.classList.add('shine'); },900);
  }
  fonts.then(function(){
    var stages=[].slice.call(document.querySelectorAll('.stage'));
    if(!('IntersectionObserver' in window)){ stages.forEach(reveal); return; }
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ reveal(e.target); io.unobserve(e.target);} }); },{threshold:.12});
    stages.forEach(function(s){ io.observe(s); });
  });
})();
