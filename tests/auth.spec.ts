import { test, expect } from '@playwright/test';
import { config } from 'dotenv';
config({ path: './env' });
import { APP_URL } from '@/app/config';
const AUTH_SESSION_COOKIE = 'horizon-session';

test.describe('authentication', () => {
    test('Login works and sets session cookie', async({ request, page, browser }) => {
        await page.goto(APP_URL + '/admin/login');
        const context = browser.contexts()[0];
        let cookies = await context.cookies();
        let authCookie = cookies.find(cookie => {
            return cookie.name === AUTH_SESSION_COOKIE
        });
        expect(authCookie).toBeFalsy();
        await expect(page).toHaveTitle('Horizon | Login');
        const heading = page.getByRole('heading', { name: 'login' });
        await expect(heading).toBeVisible();
        await expect(heading).toHaveClass('text-3xl font-bold');
        const emailLabel = page.getByLabel('Email');
        await emailLabel.click();
        await page.$eval('input[name="email"]', (element) => {
            element === document.activeElement;
        });
        await page.getByRole('textbox', { name: 'email' }).fill('test@example.com');
        await page.getByRole('textbox', { name: 'password' }).fill('testuser123');
        const submitButton = page.getByRole('button', { name: 'Login' });
        await expect(submitButton).toBeVisible();
        await submitButton.click();
        await expect(page).toHaveURL(APP_URL + '/admin');
        cookies = await browser.contexts()[0].cookies()
        // const cookies = await page.context().cookies();
        authCookie = cookies.find(cookie => {
            return cookie.name === AUTH_SESSION_COOKIE
        });
        expect(authCookie).toBeTruthy();
    });
});
