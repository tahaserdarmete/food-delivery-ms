import { catchAsync } from "./utils/index.js";
import deliveryService from "./delivery.service.js";
import { deliveryUpdateSchema, validateDTO } from "./delivery.dto.js";

class DeliveryController {
  getAvaibleDeliveries = catchAsync(async (req, res, next) => {
    const deliveries = await deliveryService.getAvailableDeliveries();

    res.status(200).json({
      status: "success",
      message: "Müsait siparişler",
      data: deliveries,
    });
  });

  acceptDelivery = catchAsync(async (req, res, next) => {
    const orderId = req.params.orderId!;
    const courierId = req.user!.userId;

    const result = await deliveryService.acceptDelivery(orderId, courierId);

    res.status(200).json({
      status: "success",
      message: "Sipariş kuryeye atandı",
      data: result,
    });
  });

  updateDelivery = catchAsync(async (req, res, next) => {
    const deliveryData = validateDTO(deliveryUpdateSchema, req.body);
    const courierId = req.user!.userId;
    const orderId = req.params.orderId!;

    const result = await deliveryService.updateDelivery(
      orderId,
      courierId,
      deliveryData
    );

    res.status(200).json({
      status: "success",
      message: "Sipariş durumu güncellendi",
      data: result,
    });
  });

  trackDelivery = catchAsync(async (req, res, next) => {
    const orderId = req.params.orderId!;

    const result = await deliveryService.trackDelivery(orderId);

    res.status(200).json({
      status: "success",
      message: "Sipariş takip bilgisi",
      data: result,
    });
  });
}

export default new DeliveryController();
