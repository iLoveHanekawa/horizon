import { test, expect } from '@playwright/test';
import { config } from 'dotenv';
config({ path: './env' });
import { APP_URL } from '@/app/config';
const AUTH_SESSION_COOKIE = 'horizon-session';
import prisma from '@/db';

test.describe('authentication', () => {
    test('Login works and sets session cookie', async({ page, browser }) => {
        await page.goto(APP_URL + '/admin/login');
        const context = browser.contexts()[0];
        let cookies = await context.cookies();
        let authCookie = cookies.find(cookie => {
            return cookie.name === AUTH_SESSION_COOKIE
        });
        expect(authCookie).toBeFalsy();
        await expect(page).toHaveTitle('Horizon | Login');
        const heading = page.getByRole('heading', { name: 'Login' });
        await expect(heading).toBeVisible();
        await expect(heading).toHaveClass('text-3xl font-bold');
        const emailLabel = page.getByLabel('Email', { exact: true });
        await emailLabel.click();
        await page.$eval('input[name="email"]', (element) => {
            element === document.activeElement;
        });
        await page.getByRole('textbox', { name: 'email' }).fill('test@example.com');
        await page.getByRole('textbox', { name: 'password' }).fill('testuser123');
        const submitButton = page.getByRole('button', { name: 'Login', exact: true });
        await expect(submitButton).toBeVisible();
        await submitButton.click();
        await expect(page).toHaveURL(APP_URL + '/admin');
        cookies = await browser.contexts()[0].cookies()
        authCookie = cookies.find(cookie => {
            return cookie.name === AUTH_SESSION_COOKIE
        });
        expect(authCookie).toBeTruthy();
    });

    test('Register works and sets session cookie', async ({ page, browser }) => {

        const context = browser.contexts()[0];
        let cookies = await context.cookies();
        let authCookie = cookies.find(cookie => {
            return cookie.name === AUTH_SESSION_COOKIE
        });
        // get rid of the test user if he exists.
        const TEST_EMAIL = 'test@example.com';
        const user = await prisma.user.findFirst({
            where: {
                email: TEST_EMAIL
            }
        });
        if(user) {
            await prisma.user.delete({
                where: {
                    email: TEST_EMAIL
                }
            });
        }
        await page.goto(APP_URL + '/admin/register');
        await expect(page).toHaveTitle('Horizon | Register');
        const heading = page.getByRole('heading', { name: 'Register'})
        await expect(heading).toBeVisible();
        await expect(heading).toHaveClass('text-3xl font-bold');
        const labels: { labelName: string; formItemName: string }[] = [
            { labelName: 'First name', formItemName: 'firstname' }, 
            { labelName: 'Last name', formItemName: 'lastname'}, 
            { labelName: 'Email', formItemName: 'email'}, 
            { labelName: 'Password', formItemName: 'password' }, 
            { labelName: 'Confirm password', formItemName: 'confirm-password' }
        ];
        const label = page.getByLabel('First name');
        expect(label).toBeVisible();

        const labelPromises = labels.map(async ({ labelName, formItemName }) => {
            const label = page.getByLabel(labelName, { exact: true });
            await label.click();
            await page.$eval(`input[name="${formItemName}"]`, (element) => {
                return element === document.activeElement;
            });
        });

        await Promise.all(labelPromises);

        await page.getByTestId('email').fill('test@example.com');
        await page.getByTestId('lastname').fill('User');
        await page.getByTestId('password').fill('testuser123');
        await page.getByTestId('firstname').fill('Test');
        await page.getByTestId('confirm-password').fill('testuser123');
        await page.getByTestId('submit').click();

        await expect(page).toHaveURL(APP_URL + '/admin');
        cookies = await browser.contexts()[0].cookies()
        authCookie = cookies.find(cookie => {
            return cookie.name === AUTH_SESSION_COOKIE
        });
        expect(authCookie).toBeTruthy();
    });
});
