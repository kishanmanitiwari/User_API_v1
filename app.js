import express from "express";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import cors from "cors";
import router from "./routes/users.js";



const app = express();

const PORT = process.env.PORT || 3000;

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://restusers.netlify.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Mount the user routes at /api/users
app.use("/api/users", router);

//Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
