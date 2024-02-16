import 'server-only';

export const AUTH_SESSION_COOKIE = 'horizon-session';
export const JWT_SECRET = process.env.JWT_SECRET;
export const AUTH_COOKIE_EXPIRATION_IN_MILISECONDS = 10000;
export const SALT_ROUNDS = 10;