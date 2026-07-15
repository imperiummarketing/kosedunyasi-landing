const { copyFileSync, cpSync, mkdirSync, rmSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");
const dist = join(root, "dist");

const files = [
  "index.html",
  "privacy.html",
  "cookies.html",
  "404.html",
  "_headers",
  "_redirects",
  "robots.txt",
  "sitemap.xml",
];

const dirs = ["assets", "css", "js", "api"];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const file of files) {
  copyFileSync(join(root, file), join(dist, file));
}

for (const dir of dirs) {
  cpSync(join(root, dir), join(dist, dir), { recursive: true });
}

console.log(`Built Worker assets in ${dist}`);
