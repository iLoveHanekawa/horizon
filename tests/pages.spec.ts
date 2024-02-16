import { test, expect } from '@playwright/test';
import { config } from 'dotenv';
config({ path: './env' });

const prodUrl = process.env.APP_URL_PROD;
const devUrl = process.env.APP_URL_DEV;
const url = process.env.NODE_ENV === 'development'? devUrl: prodUrl;

test('redirections', async({ request }) => {
    const req = await request.get(url + '/admin');
    expect(req.url()).toEqual(url + '/admin/login');
});

test.describe('auth pages', () => {
    test.beforeEach(async({ page }) => {
        await page.goto(url + '/admin/login');
        
    })
    test('login page ui', async({ request }) => {
        
    });
});