// middlewares/auth.js
import dotenv from "dotenv";
dotenv.config();

const validAPIKey = process.env.API_Key;

export function checkApiKey(req, res, next) {
  const apiKey = req.headers.appid;

  if (!apiKey) {
    return res.status(401).json({ error: "API key is missing" });
  }

  if (apiKey !== validAPIKey) {
    return res.status(401).json({ error: "Unauthorized Access" });
  }
  next();
}
