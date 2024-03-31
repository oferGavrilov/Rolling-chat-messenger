import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    HOST: host(),
    MONGO_LOCAL_URI: str(),
    MONGO_ATLAS_URI: str(),
    JWT_SECRET: str(),
    JWT_REFRESH_SECRET: str(),
    EMAIL: str(),
    EMAIL_PASSWORD: str(),
    CLOUDINARY_CLOUD_NAME: str(),
    CLOUDINARY_API_KEY: str(),
    CLOUDINARY_API_SECRET: str(),
    COMMON_RATE_LIMIT_WINDOW_MS: num(),
    COMMON_RATE_LIMIT_MAX_REQUESTS: num(),
    CORS_ORIGIN: str(),
    SALT_ROUNDS: str(),
});