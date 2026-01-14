import mongoose, { Schema } from "mongoose";
import type { IMenuItem, IRestaurant } from "./types/index.js";

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: [true, "Ad zorunludur"] },
    description: { type: String, required: [true, "Açıklama zorunludur"] },
    address: { type: String, required: [true, "Adres zorunludur"] },
    phone: { type: String, required: [true, "Telefon zorunludur"] },
    email: { type: String, required: [true, "Email zorunludur"] },
    categories: { type: [String], required: [true, "Kategoriler zorunludur"] },
    deliveryTime: {
      type: Number,
      required: [true, "Teslimat süresi zorunludur"],
    },
    minOrderPrice: {
      type: Number,
      required: [true, "En az sipariş ücreti zorunludur"],
    },
    deliveryFee: {
      type: Number,
      required: [true, "Teslimat ücreti zorunludur"],
    },
    isActive: { type: Boolean, default: true },
    isOpen: { type: Boolean, default: false },
    ownerId: { type: String, required: [true, "Sahibinin id'si zorunludur"] },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc: any, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const menuItemSchema = new Schema<IMenuItem>(
  {
    restaurantId: { type: Schema.Types.ObjectId, required: true, trim: true },
    name: { type: String, required: [true, "Ad zorunludur"], trim: true },
    description: {
      type: String,
      required: [true, "Açıklama zorunludur"],
      trim: true,
    },
    price: { type: Number, required: [true, "Fiyat zorunludur"], min: 0 },
    category: {
      type: String,
      required: [true, "Kategori zorunludur"],
      trim: true,
    },
    imageUrl: { type: String, default: "" },
    ingredients: { type: [String], default: [] },
    allergens: { type: [String], default: [] },
    isVegetarian: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    preparationTime: {
      type: Number,
      required: [true, "Hazırlama süresi zorunludur"],
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc: any, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const MenuItem = mongoose.model<IMenuItem>("MenuItem", menuItemSchema);
export default mongoose.model<IRestaurant>("Restaurant", restaurantSchema);
