import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 3 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'],['allure-playwright']],
  timeout: 100000,
  /* Global test timeout */
  globalTimeout: 600000, // 10 minutes
  /* Expect timeout for assertions */
  expect: {
    timeout: 10000,
    toMatchSnapshot: {
      maxDiffPixels: 10
    }
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
     baseURL: 'https://app.misklms.com/analytics',

    // Collect trace when retrying the failed test.
    video: 'on',
    trace: 'on',
    screenshot:'only-on-failure',
    browserName: 'chromium',
    channel: 'chrome',
    headless: true,
  },

  /* Configure projects for major browsers */
  //If you want to run the pipeline in specific browser, you can use the following code
  //npx playwright test --grep "@end-to-end" --project=chromium

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' } 
    },

    {
      name: 'firefox',
      use: { browserName: 'firefox' }
    },

    {
      name: 'webkit',
      use: { browserName: 'webkit' } 
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
