import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV,
    WHITELISTED_ORIGINS: [process.env.WHITELISTED_ORIGINS],
    MONGO_URL: process.env.MONGO_URL
}

export default config