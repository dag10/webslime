import { chromium } from "playwright";

const port = process.argv[2];
if (!port) {
  console.error("Usage: node test-visual.mjs <port>");
  process.exit(1);
}

const url = `http://localhost:${port}/index.html`;
const consoleMessages = [];

const browser = await chromium.launch({
  args: ["--use-gl=angle"],
});

const context = await browser.newContext({
  viewport: { width: 720, height: 960 },
  deviceScaleFactor: 1,
});

const page = await context.newPage();

page.on("console", (msg) => {
  consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
});

page.on("pageerror", (err) => {
  consoleMessages.push(`[error] ${err.message}`);
});

console.log(`Navigating to ${url}...`);
await page.goto(url, { waitUntil: "domcontentloaded" });

// Wait for canvas element
await page.waitForSelector("canvas#c", { timeout: 5000 });
console.log("Canvas found, waiting for simulation warmup...");

// Let the simulation initialize and settle
await page.waitForTimeout(2000);

// Screenshot idle state
await page.screenshot({ path: "/tmp/webslime-idle.png" });
console.log("Saved /tmp/webslime-idle.png");

// Simulate drag from center toward top edge
const cx = 360;
const cy = 480;
const targetX = 360;
const targetY = 50;

await page.mouse.move(cx, cy);
await page.mouse.down();

// Smooth drag movement
await page.mouse.move(targetX, targetY, { steps: 30 });

// Hold at edge for 1 second
await page.waitForTimeout(1000);

// Screenshot while dragging
await page.screenshot({ path: "/tmp/webslime-dragging.png" });
console.log("Saved /tmp/webslime-dragging.png");

await page.mouse.up();

// Write console log
const { writeFile } = await import("node:fs/promises");
await writeFile("/tmp/webslime-console.log", consoleMessages.join("\n") + "\n");
console.log(`Saved /tmp/webslime-console.log (${consoleMessages.length} messages)`);

await browser.close();
