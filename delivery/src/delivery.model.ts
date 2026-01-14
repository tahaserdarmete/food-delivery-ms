import mongoose, { Schema } from "mongoose";
import type { ICourier, IDelivery, Location } from "./types/index.js";

const locationSchema = new Schema<Location>(
  {
    lat: { type: Number, required: [true, "Enlem zorunludur"] },
    lon: { type: Number, required: [true, "Boylam zorunludur"] },
  },
  { _id: false }
);

const deliverySchema = new Schema<IDelivery>(
  {
    orderId: { type: String, required: [true, "Sipariş id'si zorunludur"] },
    courierId: { type: String, default: null },
    status: {
      type: String,
      required: [true, "Durum zorunludur"],
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "on_the_way",
        "delivered",
        "cancelled",
      ],
    },
    location: { type: locationSchema, default: null },
    actualDeliveryTime: { type: Date, default: null },
    acceptedAt: { type: Date, default: null },
    notes: { type: String, default: null },
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

const courierSchema = new Schema<ICourier>(
  {
    firstName: { type: String, required: [true, "Ad zorunludur"] },
    lastName: { type: String, required: [true, "Soyad zorunludur"] },
    email: { type: String, required: [true, "Email zorunludur"], unique: true },
    phone: { type: String, required: [true, "Telefon zorunludur"] },
    status: {
      type: String,
      required: [true, "Durum zorunludur"],
      enum: ["available", "busy", "offline"],
      default: "available",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc: any, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  }
);

export const Courier = mongoose.model<ICourier>("Courier", courierSchema);
export default mongoose.model<IDelivery>("Delivery", deliverySchema);
