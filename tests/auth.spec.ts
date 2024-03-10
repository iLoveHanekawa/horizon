import { test, expect } from '@playwright/test';
import { config } from 'dotenv';
config({ path: './env' });
import { APP_URL } from '@/app/config';
const AUTH_SESSION_COOKIE = 'horizon-session';
import prisma from '@/db';

test.describe('authentication', () => {

    test('Login does not work with incorrect password', async({ page, browser }) => {
        await page.goto(APP_URL + '/login');
        const context = browser.contexts()[0];
        let cookies = await context.cookies();
        let authCookie = cookies.find(cookie => {
            return cookie.name === AUTH_SESSION_COOKIE
        });
        expect(authCookie).toBeFalsy();
        await page.getByTestId('email').fill('test@example.com');
        await page.getByTestId('password').fill('testuse');
        await page.getByTestId('submit').click();
        await expect(page).toHaveURL(APP_URL + '/login');
        cookies = await browser.contexts()[0].cookies()
        authCookie = cookies.find(cookie => {
            return cookie.name === AUTH_SESSION_COOKIE
        });
        expect(authCookie).toBeFalsy();
    })

    test('Login works and sets session cookie', async({ page, browser }) => {
        await page.goto(APP_URL + '/login');
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
        await page.getByTestId('email').fill('test@example.com');
        await page.getByTestId('password').fill('testuser123');
        const submitButton = page.getByTestId('submit');
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
        const user = await prisma.user.findUnique({
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
        await page.goto(APP_URL + '/register');
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

test.describe('login validation errors', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(APP_URL + '/login');
    });
    test('required tags are present on inputs', async ({ page }) => {
        const emailInput = page.getByTestId('email');
        await expect(emailInput).toHaveAttribute('required');
        const passwordInput = page.getByTestId('password');
        await expect(passwordInput).toHaveAttribute('required');
    })
    test('shows the correct error message when user email is not registered', async ({ page }) => {
        await page.getByTestId('email').fill('xyz@gmail.com');
        await page.getByTestId('password').fill('x');
        await page.getByTestId('submit').click();
        const emailErrorList = page.getByTestId('error-email');
        await expect(emailErrorList).toHaveText('The entered email has not been registered yet. Please sign up first.');
    });
    test('shows the correct error when password is incorrect', async ({ page }) => {
        await page.getByTestId('email').fill("test@example.com");
        await page.getByTestId('password').fill("testuser12");
        await page.getByTestId('submit').click();
        const passwordErrorList = page.getByTestId('error-password');
        await expect(passwordErrorList).toHaveText('Incorrect username or password.');
    });
});

test.describe('register validation errors', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(APP_URL + '/register');
    });
    test('required tags are present on inputs', async ({ page }) => {
        const emailInput = page.getByTestId('email');
        const lastnameInput = page.getByTestId('lastname');
        const passwordInput = page.getByTestId('password');
        const firstnameInput = page.getByTestId('firstname');
        const confirmPasswordInput = page.getByTestId('confirm-password');
        await expect(emailInput).toHaveAttribute('required');
        await expect(lastnameInput).toHaveAttribute('required');
        await expect(passwordInput).toHaveAttribute('required');
        await expect(firstnameInput).toHaveAttribute('required');
        await expect(confirmPasswordInput).toHaveAttribute('required');
    });
    test('email has to be unique', async ({ page }) => {
        const emailInput = page.getByTestId('email');
        const lastnameInput = page.getByTestId('lastname');
        const passwordInput = page.getByTestId('password');
        const firstnameInput = page.getByTestId('firstname');
        const confirmPasswordInput = page.getByTestId('confirm-password');
        await emailInput.fill('test@example.com');
        await lastnameInput.fill('test');
        await firstnameInput.fill('user');
        await passwordInput.fill('12345678');
        await confirmPasswordInput.fill('12345678');
        await page.getByTestId('submit').click();
        const url = page.url();
        expect(url).toBe(APP_URL + '/register');
        const emailErrorList = page.getByTestId('error-email');
        await expect(emailErrorList).toHaveText('The email you have entered is already registered. Please try to log in.');
    });

    test('passwords show errors when they do not match', async ({ page }) => {
        const emailInput = page.getByTestId('email');
        const lastnameInput = page.getByTestId('lastname');
        const passwordInput = page.getByTestId('password');
        const firstnameInput = page.getByTestId('firstname');
        const confirmPasswordInput = page.getByTestId('confirm-password');
        await emailInput.fill('test2@example.com');
        await lastnameInput.fill('test');
        await firstnameInput.fill('user');
        await passwordInput.fill('12345678');
        await confirmPasswordInput.fill('12345678x');
        await page.getByTestId('submit').click();
        const url = page.url();
        expect(url).toBe(APP_URL + '/register');
        const confirmPasswordErrorList = page.getByTestId('error-confirm-password');
        await expect(confirmPasswordErrorList).toHaveText('Passwords do not match!');
    });

    test('short passwords should throw errors.', async ({ page }) => {
        const emailInput = page.getByTestId('email');
        const lastnameInput = page.getByTestId('lastname');
        const passwordInput = page.getByTestId('password');
        const firstnameInput = page.getByTestId('firstname');
        const confirmPasswordInput = page.getByTestId('confirm-password');
        await emailInput.fill('test2@example.com');
        await lastnameInput.fill('test');
        await firstnameInput.fill('user');
        await passwordInput.fill('12');
        await confirmPasswordInput.fill('12');
        await page.getByTestId('submit').click();
        const url = page.url();
        expect(url).toBe(APP_URL + '/register'); 
        const confirmPasswordErrorList = page.getByTestId('error-confirm-password');
        await expect(confirmPasswordErrorList).toHaveText('String must contain at least 8 character(s)');
        const passwordErrorList = page.getByTestId('error-password');
        await expect(passwordErrorList).toHaveText('String must contain at least 8 character(s)');
    });

    test('short names should throw errors.', async ({ page }) => {
        const emailInput = page.getByTestId('email');
        const lastnameInput = page.getByTestId('lastname');
        const passwordInput = page.getByTestId('password');
        const firstnameInput = page.getByTestId('firstname');
        const confirmPasswordInput = page.getByTestId('confirm-password');
        await emailInput.fill('test2@example.com');
        await lastnameInput.fill('t');
        await firstnameInput.fill('u');
        await passwordInput.fill('12345678');
        await confirmPasswordInput.fill('12345678');
        await page.getByTestId('submit').click();
        const url = page.url();
        expect(url).toBe(APP_URL + '/register');
        const firstnameErrorList = page.getByTestId('error-firstname');
        const lastnameErrorList = page.getByTestId('error-lastname');
        await expect(lastnameErrorList).toBeVisible();
        await expect(firstnameErrorList).toBeVisible();
        await expect(firstnameErrorList).toHaveText('String must contain at least 2 character(s)');
        await expect(lastnameErrorList).toHaveText('String must contain at least 2 character(s)');
    })
});
