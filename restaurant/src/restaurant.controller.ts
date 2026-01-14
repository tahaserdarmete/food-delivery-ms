import { catchAsync } from "./utils/index.js";
import restaurantService from "./restaurant.service.js";
import {
  createMenuItemSchema,
  createRestaurantSchema,
  queryParamsSchema,
  validateDTO,
} from "./restaurant.dto.js";

class RestaurantController {
  getAllRestaurants = catchAsync(async (req, res, next) => {
    // arama parametrelerini kontrol et
    const queryParams = await validateDTO(queryParamsSchema, req.query);

    // servis methodunu çağır
    const result = await restaurantService.getAllRestaurants(queryParams);

    // client'a cevap gönder
    res.status(200).json({
      status: "success",
      message: "Tüm restorantlar listelendi",
      data: result,
    });
  });

  getRestaurantById = catchAsync(async (req, res, next) => {
    const id = req.params.id!;

    const result = await restaurantService.getRestaurantById(id);

    res.status(200).json({
      status: "success",
      message: "Restaurant bulundu",
      data: result,
    });
  });

  getRestaurantMenu = catchAsync(async (req, res, next) => {
    const restaurantId = req.params.id!;
    const category = req.query.category as string | undefined;

    const result = await restaurantService.getRestaurantMenu(
      restaurantId,
      category
    );

    res.status(200).json({
      status: "success",
      message: "Restaurant menüsü",
      data: result,
    });
  });

  createRestaurant = catchAsync(async (req, res, next) => {
    // client'ran gelen veriler geçerli mi
    const body = await validateDTO(createRestaurantSchema, req.body);

    const ownerId = req.user!.userId;

    // server methodunu çağır
    const result = await restaurantService.createRestaurant(body, ownerId);

    // client'a cevap gönder
    res.status(201).json({
      status: "success",
      message: "Restorant başarıyla oluşturuldu",
      data: result,
    });
  });

  createMenuItem = catchAsync(async (req, res, next) => {
    // client'dan gelen veriler geçerli mi
    const body = await validateDTO(createMenuItemSchema, req.body);
    const restaurantId = req.params.id!;

    // servis methodunu çağır
    const result = await restaurantService.createMenuItem(body, restaurantId);

    // client'a cevap gönder
    res.status(201).json({
      status: "success",
      message: "Menü ürünü başarıyla oluşturuldu",
      data: result,
    });
  });
}

export default new RestaurantController();
