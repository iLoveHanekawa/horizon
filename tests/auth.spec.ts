import { test, expect } from '@playwright/test';

test.describe('authentication', () => {
    test.beforeEach(async ({ page }) => {
        const res = await page.goto('http://localhost:3000');
        expect(res?.ok()).toBeTruthy();
    });
    test('Login works and sets session cookie', async({ request }) => {
        
    })
});