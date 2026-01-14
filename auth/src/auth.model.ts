import mongoose from "mongoose";
import type { IUser } from "./types/index.js";

// kullanıcı için Shema
const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email zorunludur"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Şifre zorunludur"],
    },
    firstName: {
      type: String,
      required: [true, "Ad zorunludur"],
    },
    lastName: {
      type: String,
      required: [true, "Soyad zorunludur"],
    },
    phone: {
      type: String,
      required: [true, "Telefon zorunludur"],
    },
    role: {
      type: String,
      enum: ["customer", "restaurant_owner", "courier", "admin"],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      // Client'a gönderilen verinin formatlanması
      transform: (doc: any, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  }
);

// model
export default mongoose.model<IUser>("User", userSchema);
