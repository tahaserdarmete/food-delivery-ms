import type { NextFunction, Request, Response } from "express";
import type { Error } from "mongoose";
import jwt from "jsonwebtoken";
import type { JWTPayload, UserRole } from "./types/index.js";

// hata middleware
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = err.message || "Bir şeyler ters gitti..";
  console.log(message);
  res.status(500).json({ status: "error", message });
};

//  404 middleware
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .status(404)
    .json({ status: "error", message: "İstek attığınız adres bulunamadı" });
};

// jwt token doğrulama
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Token kontrolü
    const accessToken = req.cookies.token;

    if (!accessToken) {
      res.status(401).json({ status: "error", message: "Token bulunamadı" });
      return;
    }

    // token geçerli mi
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET
    ) as JWTPayload;

    // controller fonksiyonunda kullanıcı verisine erişmek için request nesnesine kullanıcıyı ekle
    req.user = decoded;

    // sonrali işleme devam et
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        status: "error",
        message: "Token süresi doldu",
      });
    } else {
      res.status(401).json({
        status: "error",
        message: "Token geçersiz",
      });
    }
  }
};

// Rol kontrolü middleware
export const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Kullanıcı oturumu açık mı
    if (!req.user) {
      res.status(401).json({
        status: "error",
        message: "Kullanıcı bulunamadı",
      });

      return;
    }

    // kullanıcının rolü izin veriler roller dizisinde var mı
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        status: "error",
        message: "Bu işlemi gerçekleştirmek için yetkiniz yok",
      });

      return;
    }

    // rolü yeterli ise sonraki işleme devam et
    next();
  };
};
