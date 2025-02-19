import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer';

export const getBrowserInstance = async (size) => {
  const executablePath = await chromium.executablePath;

  if (!executablePath) {
    return puppeteer.launch({
      args: chromium.args,
      headless: true,
      defaultViewport: size,
      ignoreHTTPSErrors: true,
    });
  }

  return chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: size,
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
};
