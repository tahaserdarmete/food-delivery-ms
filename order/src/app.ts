import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { errorMiddleware, notFoundMiddleware } from "./order.middleware.js";
import orderRoutes from "./order.routes.js";

// dotenv ile .env dosyasını yükle
dotenv.config();

// express uygulaması oluştur
const app = express();

// mongoose ile MongoDB'ye bağlan
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB'ye bağlandı"))
  .catch(() => console.log("❌ MongoDB'ye bağlanılamadı"));

// rate limit ayarları
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQ),
});

// middleware'leri ayarla
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(limiter);

// routes'ları tanımla
app.use("/", orderRoutes);

// hata mw
app.use(errorMiddleware);

// 404 mw
app.use(notFoundMiddleware);

// express uygulamsını başlat
app.listen(process.env.PORT, () => {
  console.log(`✅ Order Service ${process.env.PORT} portunda çalışıyor...`);
});
