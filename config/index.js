import dotenv from "dotenv";

dotenv.config();

const config = {
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtExpiry: process.env.JWT_EXPIRY,
  allowedOrigins: process.env.ALLOWED_ORIGINS.split(","),
  mongoDbUri: process.env.MONGODB_URI,
  port: process.env.PORT,
};

export default config;
