import mongoose, { Schema } from "mongoose";
import type { IAddress, IOrder, IOrderItem } from "./types/index.js";

// sipariş edilen ürünün tipi
const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: [true, "Ürün ID'si zorunludur"] },
    name: { type: String, required: [true, "Ürün adı zorunludur"] },
    price: { type: Number, required: [true, "Fiyat zorunludur"] },
    quantity: { type: Number, required: [true, "Adet zorunludur"] },
  },
  { _id: false }
);

// teslimat adresi tipi
const addressSchema = new Schema<IAddress>(
  {
    title: { type: String, required: [true, "Başlık zorunludur"] },
    address: { type: String, required: [true, "Adres zorunludur"] },
    city: { type: String, required: [true, "Şehir zorunludur"] },
    district: { type: String, required: [true, "İlçe zorunludur"] },
    postalCode: { type: String, required: [true, "Posta kodu zorunludur"] },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

// sipariş modeli
const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: [true, "Kullanıcı ID'si zorunludur"] },
    restaurantId: {
      type: String,
      required: [true, "Restaurant ID'si zorunludur"],
    },
    deliveryAddress: {
      type: addressSchema,
      required: [true, "Teslimat adresi zorunludur"],
    },
    items: {
      type: [orderItemSchema],
      required: [true, "Sipariş ürünleri zorunludur"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Ödeme methodu zorunludur"],
      enum: ["credit-card", "cash", "mobile_payment"],
    },
    status: {
      type: String,
      required: [true, "Sipariş durumu zorunludur"],
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "on_the_way",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    specialInstructions: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc: any, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// toplam fiyatı sanal değer olarak hesapla (virtual property)
orderSchema.virtual("totalprice").get(function () {
  return this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

export default mongoose.model<IOrder>("Order", orderSchema);
