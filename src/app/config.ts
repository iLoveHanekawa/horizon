export const APP_URL_DEV = process.env.APP_URL_DEV;
export const APP_URL_PROD = process.env.APP_URL_PROD;
export const APP_URL = process.env.NODE_ENV === 'development'? APP_URL_DEV: APP_URL_PROD;