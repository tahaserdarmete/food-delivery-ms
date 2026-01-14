import express from "express";
import restaurantController from "./restaurant.controller.js";
import { authenticate, authorize } from "./restaurant.middleware.js";

const router = express.Router();

router.get("/", authenticate, restaurantController.getAllRestaurants);
router.get("/:id", authenticate, restaurantController.getRestaurantById);
router.get("/:id/menu", authenticate, restaurantController.getRestaurantMenu);
router.post(
  "/:id/menu",
  authenticate,
  authorize(["restaurant_owner", "admin"]),
  restaurantController.createMenuItem
);
router.post(
  "/",
  authenticate,
  authorize(["restaurant_owner", "admin"]),
  restaurantController.createRestaurant
);

export default router;
