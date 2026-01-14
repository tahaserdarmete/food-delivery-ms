import type { NextFunction, Request, Response } from "express";
import { Document, Types } from "mongoose";

export type RouteParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type UserRole = "customer" | "restaurant_owner" | "courier" | "admin";

export interface JWTPayload {
  userId: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface IRestaurant extends Document {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  categories: string[];
  deliveryTime: number;
  minOrderPrice: number;
  deliveryFee: number;
  isActive: boolean;
  isOpen: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMenuItem extends Document {
  restaurantId: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  ingredients: string[];
  allergens: string[];
  isVegetarian: boolean;
  isAvailable: boolean;
  preparationTime: number;
  createdAt: Date;
  updatedAt: Date;
}
