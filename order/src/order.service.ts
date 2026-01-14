import type { OrderInput } from "./order.dto.js";
import Order from "./order.model.js";
import type { OrderStatus } from "./types/index.js";
import RabbitMQService from "./rabbitmq.service.js";

// Business Logic'i yöneticek ve veritabanı ile iletişime geç
class OrderService {
  private initialized: boolean = false;

  async initialize() {
    if (!this.initialized) {
      await RabbitMQService.initialize();
      this.initialized = true;
    }
  }

  async createOrder(body: OrderInput, userId: string) {
    await this.initialize();

    // sipariş oluştur
    const newOrder = await Order.create({ ...body, userId });

    // sipariş oluşturulduğunun haberini delivery servisine gönder
    await RabbitMQService.publishMessage("order.created", newOrder);

    return newOrder;
  }

  async getUserOrders(userId: string) {
    return await Order.find({ userId });
  }

  async getOrderById(orderId: string) {
    return await Order.findById(orderId);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    await this.initialize();

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    //  sipariş hazır olduysa delivery servisine haber ver
    await RabbitMQService.publishMessage("order.ready", order);

    return order;
  }
}

export default new OrderService();
