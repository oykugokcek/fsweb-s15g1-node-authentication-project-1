// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!
const router = require("express").Router();
const Users = require("../users/users-model");
const bcrypt = require("bcryptjs");
const mw = require("./auth-middleware");
const jwt = require("jsonwebtoken");
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */
router.post(
  "/register",
  mw.sifreGecerlimi,
  mw.usernameBostami,
  async (req, res, next) => {
    try {
      const newUser = req.body;
      const hash = bcrypt.hashSync(newUser.password, 8);
      newUser.password = hash;

      const insertedUser = await Users.ekle(newUser);
      res.status(201).json(insertedUser);
    } catch (error) {
      next(error);
    }
  }
);

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */

router.post(
  "/login",
  mw.usernameVarmi,
  mw.sifreGecerlimi,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const presentUser = await Users.goreBul({
        username,
      }).first();
      const isTruePassword = bcrypt.compareSync(password, presentUser.password);
      if (presentUser && isTruePassword) {
        req.session.user = presentUser;
        res.json({ message: `Hoşgeldin ${presentUser.username}` });
      } else {
        next({
          status: 401,
          message: "Geçersiz kriter",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */

router.get("/logout", (req, res, next) => {
  try {
    if (req.session.user) {
      req.session.destroy((err) => {
        if (err) {
          next({
            message: "Hata",
          });
        } else {
          next({
            status: 200,
            message: "çıkış yapildi",
          });
        }
      });
    } else {
      next({
        status: 200,
        message: "oturum bulunamadı!",
      });
    }
  } catch (error) {}
});

// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.
module.exports = router;
