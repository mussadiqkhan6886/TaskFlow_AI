import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,          // shared test DB — start conservative, see earlier note
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: 'html',

    use: {
        baseURL: 'http://localhost:3000',   
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        }
    ],

    webServer: [
        {
            command: 'npm run start:e2e',
            cwd: '../backend',
            url: 'http://localhost:4000/health',   // needs a real health-check route — see below
            timeout: 120_000,
            reuseExistingServer: !process.env.CI
        },
        {
            command: 'npm run dev',
            cwd: '../frontend',
            url: 'http://localhost:3000',
            timeout: 120_000,
            reuseExistingServer: !process.env.CI
        }
    ]
})