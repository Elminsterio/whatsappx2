export const config = {
  SECRET: process.env.SECRET || " ",
  SECRET_REFRESH: process.env.SECRET_REFRESH || " ",
  TOKEN_DURATION: process.env.TOKEN_DURATION || 300,
  REFRESH_TOKEN_DURATION: process.env.REFRESH_TOKEN_DURATION || "4d",
  SALT: parseInt(process.env.TOKEN_SALT as string) || 10,
  PORT: process.env.PORT || "3000",
  NODE_ENV: process.env.NODE_ENV || "dev",
  MONGO_URI: process.env.MONGO_URI || `mongodb://localhost:27017/OnMailTest`,
}
