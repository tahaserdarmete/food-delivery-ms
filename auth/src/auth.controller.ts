import { catchAsync } from "./utils/index.js";
import authService from "./auth.service.js";
import { loginSchema, registerSchema, validateDTO } from "./auth.dto.js";

class AuthController {
  register = catchAsync(async (req, res, next) => {
    // client dan gelen verinin doğru formatta ev eksiksiz olduğundan emin ol
    const body = await validateDTO(registerSchema, req.body);

    // servis methodunu çalıştır
    const result = await authService.register(body);

    // cookie oluştur
    res.cookie("token", result.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // client a cevap gönder
    res.status(201).json({
      status: "success",
      message: "Kullanıcı başarıyla oluşturuldu",
      data: result,
    });
  });

  login = catchAsync(async (req, res, next) => {
    // client dan gelen verinin doğru formatta ev eksiksiz olduğundan emin ol
    const body = await validateDTO(loginSchema, req.body);

    // servis methodunu çağır
    const result = await authService.login(body);

    // cookie oluştur
    res.cookie("token", result.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // client a cevap gönder
    res.status(200).json({
      status: "success",
      message: "Giriş işlemi başarılı",
      data: result,
    });
  });

  logout = catchAsync(async (req, res, next) => {
    res.clearCookie("token");

    res.status(200).json({
      status: "success",
      message: "Çıkış işlemi başarılı",
    });
  });

  profile = catchAsync(async (req, res, next) => {
    res.status(200).json({
      status: "success",
      message: "Kullanıcı profil bilgileri",
      data: req.user,
    });
  });
}

export default new AuthController();
