import { catchAsync } from "./utils/index.js";
import orderService from "./order.service.js";
import { orderSchema, validateDTO } from "./order.dto.js";

class OrderController {
  createOrder = catchAsync(async (req, res, next) => {
    // client'dan gelen veri geçerli mi kontrol et
    const body = await validateDTO(orderSchema, req.body);
    const userId = req.user!.userId;

    // servis methodunu çağır
    const result = await orderService.createOrder(body, userId);

    // client'a cevap gönder
    res.status(201).json({
      status: "success",
      message: "Sipariş başarıyla oluşturuldu",
      data: result,
    });
  });

  getUserOrders = catchAsync(async (req, res, next) => {
    const userId = req.params.userId!;

    const result = await orderService.getUserOrders(userId);

    if (!result || result.length === 0) {
      res.status(404).json({
        status: "error",
        message: "Sipariş bulunamadı",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Kullanıcının siparişleri",
      data: result,
    });
  });

  getOrderById = catchAsync(async (req, res, next) => {
    const orderId = req.params.orderId!;

    const order = await orderService.getOrderById(orderId);

    if (!order) {
      res.status(404).json({
        status: "error",
        message: "Sipariş bulunamadı",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Sipariş bulundu",
      data: order,
    });
  });

  updateOrderStatus = catchAsync(async (req, res, next) => {
    const orderId = req.params.orderId!;
    const status = req.body.status!;

    const result = await orderService.updateOrderStatus(orderId, status);

    res.status(200).json({
      status: "success",
      message: "Sipariş durumu güncellendi",
      data: result,
    });
  });
}

export default new OrderController();
