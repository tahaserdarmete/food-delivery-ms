import amqp, { type Channel, type ChannelModel } from "amqplib";

class RabbitMQServices {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private readonly exchangeName = "food_delivery_exchange";
  private readonly deliveryQueue = "delivery_queue";

  //   RabbitMq bağlantısı oluştur
  /*
   * Notlar:
   * - Exchange tipi "topic": routing key'e göre mesajları kuyruğa yönlendirir.
   * - (durable:true): RabbitMq restart edildise bile exchange kalır
   */

  async initialize(): Promise<void> {
    try {
      //  RabbitMQ' ya bağlan
      const url = process.env.RABBITMQ_URI;
      this.connection = await amqp.connect(url);

      // Kanal oluştur
      this.channel = await this.connection.createChannel();

      console.log("✅ RabbitMQ bağlandı");
    } catch (error) {
      console.error(
        "RabbitMQ bağlantısı oluşturulurken bir hata oluştu:",
        error
      );
    }
  }

  // !   Mesajları kuyruğa gönder
  // * routingKey: mesajın hangi kuyruğa gönderileceğini belirler(order.created)
  // * rawMessage: mesaj içeriği
  // * persistent: mesajın kalıcı olmasını sağlar. rabbitmq restart edilse bile diske kaydediğidiği için mesajlar kaybolmaz
  async publishMessage(routingKey: string, rawMessage: unknown) {
    if (!this.channel) {
      throw new Error("RabbitMQ kanalı oluşturulamadı");
    }

    // yayımlanacak mesajı hazırla
    const message = Buffer.from(JSON.stringify(rawMessage));

    // mesajı exchange'e gödner
    this.channel.publish(this.exchangeName, routingKey, message, {
      persistent: true,
    });

    console.log(`✅ ${routingKey}'e mesajı gönderildi`);
  }
}

export default new RabbitMQServices();
