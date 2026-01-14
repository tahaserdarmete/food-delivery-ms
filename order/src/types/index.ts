import type { NextFunction, Response, Request } from "express";
import type { Document } from "mongoose";

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

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface IAddress {
  title: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "on_the_way"
  | "delivered"
  | "cancelled";

export interface IOrder extends Document {
  userId: string;
  restaurantId: string;
  items: IOrderItem[];
  totalPrice?: number;
  deliveryAddress: IAddress;
  paymentMethod: "credit-card" | "cash" | "mobile_payment";
  status: OrderStatus;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}
