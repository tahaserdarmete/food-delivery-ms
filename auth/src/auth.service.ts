import type { LoginInput, RegisterInput } from "./auth.dto.js";
import User from "./auth.model.js";
import type { IUser } from "./types/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import rabbitmqService from "./rabbitmq.service.js";

// Business logic işlemleri yönetecek ve veritabanı ile iletişime geçecek olan servis
class AuthService {
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (this.initialized) return;

    await rabbitmqService.initialize();
    this.initialized = true;
  }

  private generateToken(user: IUser): string {
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    return token;
  }

  async register(body: RegisterInput) {
    // email kontrolü
    const existingUser = await User.findOne({ email: body.email });

    // email kullanılıyorsa hata gönder
    if (existingUser) {
      throw new Error("Bu email adresi zaten kullanılıyor");
    }

    // Şifre hashle
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // kullanıcıyı oluştur
    const user = await User.create({ ...body, password: hashedPassword });

    // eğer oluşturulan hesap kurye hesabı ise delivery servisine mesaj gönder
    if (user.role === "courier") {
      await rabbitmqService.publishMessage("courier.created", user);
    }

    // token oluştur
    const token = this.generateToken(user);

    // client'a gönderilecek cevap
    return {
      user,
      token,
    };
  }

  async login(body: LoginInput) {
    // email kontrolü
    const user = await User.findOne({ email: body.email });

    if (!user) {
      throw new Error("Email / Şifre geçersiz");
    }

    // şifre kontrolü
    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Email / Şifre geçersiz");
    }

    // token oluştur
    const token = this.generateToken(user);

    // client'a gidecek cevap
    return {
      user,
      token,
    };
  }
}

export default new AuthService();
