import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,
  
  forbidOnly: !!process.env.CI,
  
  retries: process.env.CI ? 2 : 0,
 
  workers: 1,
  
  reporter: 'html',
  
  use: {
    trace: 'on-first-retry',
  },


  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
      viewport: {width:1920,height:1080}
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'],
        viewport: {width:1920,height:1080} },
      
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'],
        viewport: {width:1920,height:1080} },
    },

  ],

});
