const puppeteer = require("puppeteer");

class CaptureService {
  constructor({ timeoutMs = 15000, cacheMinutes = 10 } = {}) {
    this.timeoutMs = timeoutMs;
    this.cacheMs = cacheMinutes * 60 * 1000;
    this.browser = null;
    this.cache = new Map();
  }

  async getBrowser() {
    if (this.browser?.connected) return this.browser;

    const launchOptions = {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ]
    };

    if (process.env.CHROMIUM_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.CHROMIUM_EXECUTABLE_PATH;
    }

    this.browser = await puppeteer.launch(launchOptions);
    return this.browser;
  }

  getCached(key) {
    const hit = this.cache.get(key);
    if (!hit) return null;
    if (Date.now() - hit.createdAt > this.cacheMs) {
      this.cache.delete(key);
      return null;
    }
    return hit.buffer;
  }

  async screenshot(url) {
    const cached = this.getCached(url);
    if (cached) return cached;

    const browser = await this.getBrowser();
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 900, height: 1100, deviceScaleFactor: 1.5 });
      await page.goto(url, { waitUntil: "networkidle0", timeout: this.timeoutMs });
      await page.waitForSelector('body[data-capture-ready="true"]', { timeout: this.timeoutMs });
      const card = await page.waitForSelector("#discord-capture-card", { visible: true, timeout: this.timeoutMs });
      const buffer = await card.screenshot({ type: "png" });
      this.cache.set(url, { createdAt: Date.now(), buffer });
      return buffer;
    } finally {
      await page.close().catch(() => {});
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close().catch(() => {});
      this.browser = null;
    }
  }
}

module.exports = { CaptureService };
