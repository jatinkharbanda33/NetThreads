import dotenv from "dotenv";
const env = process.env.NODE_ENV || 'development'; 
const envPath = `./Config/.env.${env}`;
dotenv.config({ path: envPath });
const config = {
    PORT: process.env.PORT,
    MONGO_DB_URI: process.env.MONGO_DB_URI,
    ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET,
    REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_CLOUDFRONT_DOMAIN_NAME: process.env.AWS_CLOUDFRONT_DOMAIN_NAME,
    GMAIL_ADDRESS: process.env.GMAIL_ADDRESS,
    GMAIL_PASS: process.env.GMAIL_PASS,
    NEW_RELIC_APP_NAME: process.env.NEW_RELIC_APP_NAME,
    NEW_RELIC_LICENSE_KEY: process.env.NEW_RELIC_LICENSE_KEY
};
export default config;