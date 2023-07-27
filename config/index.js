import dotenv from "dotenv";

dotenv.config();

const config = {
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtExpiry: process.env.JWT_EXPIRY,
};

export default config;
