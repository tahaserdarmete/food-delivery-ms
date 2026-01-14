import express from "express";
import deliveryController from "./delivery.controller.js";
import { authenticate, authorize } from "./delivery.middleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(["admin", "courier"]),
  deliveryController.getAvaibleDeliveries
);
router.post(
  "/:orderId/accept",
  authenticate,
  authorize(["admin", "courier"]),
  deliveryController.acceptDelivery
);
router.patch(
  "/:orderId/status",
  authenticate,
  authorize(["admin", "courier"]),
  deliveryController.updateDelivery
);

router.get("/:orderId/track", authenticate, deliveryController.trackDelivery);

export default router;
