import type {
  CreateMenuItemInput,
  CreateRestaurantInput,
  QueryParamsInput,
} from "./restaurant.dto.js";
import Restaurant, { MenuItem } from "./restaurant.model.js";

// Business logic işlemleri yönetecek ve veritabanı ile iletişime geçecek olan servis
class RestaurantService {
  // Bütün restaurantları getir
  async getAllRestaurants(query: QueryParamsInput) {
    // Pagination (sayfalama) değişkenleri
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    // Filtreleme değişkenleri
    const filters: Record<string, any> = {};
    if (query.name) filters.name = { $regex: query.name, $options: "i" };

    if (query.categories)
      filters.categories = { $in: query.categories.split(",") };

    if (query.deliveryTime) filters.deliveryTime = { $lte: query.deliveryTime };

    if (query.minOrderPrice)
      filters.minOrderPrice = { $lte: query.minOrderPrice };

    // Veritabanı sorguları
    const [restaurants, total] = await Promise.all([
      Restaurant.find(filters).skip(skip).limit(limit),
      Restaurant.countDocuments(filters),
    ]);

    // client'a gönderilecek cevap
    return {
      page,
      limit,
      totalItems: total,
      totalPage: Math.ceil(total / limit),
      restaurants,
    };
  }

  // Bir restaurantı getir
  async getRestaurantById(id: string) {
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) throw new Error("Restaurant bulunadı");

    return restaurant;
  }

  // Yeni bir restaurant oluştur
  async createRestaurant(body: CreateRestaurantInput, ownerId: string) {
    const newRestaurant = await Restaurant.create({ ...body, ownerId });

    return newRestaurant;
  }

  // Yeni bir menü elemanı oluştur
  async createMenuItem(body: CreateMenuItemInput, restaurantId: string) {
    const newItem = await MenuItem.create({ ...body, restaurantId });
    return newItem;
  }

  // Bir restaurantın menüsünü getir
  async getRestaurantMenu(restaurantId: string, category?: string) {
    const filters: { restaurantId: string; category?: string } = {
      restaurantId,
    };

    if (category) filters.category = category;

    return await MenuItem.find(filters);
  }
}

export default new RestaurantService();
