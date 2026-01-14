import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { errorMiddleware, notFoundMiddleware } from "./auth.middleware.js";
import authRoutes from "./auth.routes.js";

// dotenv ile .env dosyasını yükle
dotenv.config();

// express uygulamasını oluştur
const app = express();

// mongoose ile mongoDB' ye bağlan
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB'ye bağlandı"))
  .catch(() => console.log("❌ MongoDB'ye bağlanmadı"));

//   rateLimit ayarları
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQ),
});

//   middleware ayarla
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(limiter);

// route tanımla
app.use("/", authRoutes);

// hata middleware
app.use(errorMiddleware);

// 404 middleware
app.use(notFoundMiddleware);

// express uygulamasını başlat
app.listen(process.env.PORT, () => {
  console.log(`✅ Auth service ${process.env.PORT} portunda çalışıyor...`);
});
