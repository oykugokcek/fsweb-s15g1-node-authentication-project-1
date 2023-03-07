const Users = require("../users/users-model");

/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  status: 401
  {
    "message": "Geçemezsiniz!"
  }
*/
function sinirli(req, res, next) {
  try {
    if (req.session.user) {
      next();
    } else {
      next({
        status: 401,
        message: "Geçemezsiniz!",
      });
    }
  } catch (error) {
    next(error);
  }
}

/*
  req.body de verilen username halihazırda veritabanında varsa

  status: 422
  {
    "message": "Username kullaniliyor"
  }
*/
async function usernameBostami(req, res, next) {
  try {
    const presentUser = await Users.goreBul({ username: req.body.username });
    if (presentUser.length > 0) {
      next({ status: 422, message: "Username kullaniliyor" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

/*
  req.body de verilen username veritabanında yoksa

  status: 401
  {
    "message": "Geçersiz kriter"
  }
*/
async function usernameVarmi(req, res, next) {
  try {
    const presentUser = await Users.goreBul({ username: req.body.username });
    if (presentUser.length > 0) {
      next();
    } else {
      next({ status: 401, message: "Geçersiz kriter" });
    }
  } catch (error) {
    next(error);
  }
}

/*
  req.body de şifre yoksa veya 3 karakterden azsa

  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
*/
function sifreGecerlimi(req, res, next) {
  try {
    const { password } = req.body;
    if (!password || password.length < 4) {
      next({ status: 422, message: "Şifre 3 karakterden fazla olmalı" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = {
  sinirli,
  usernameBostami,
  usernameVarmi,
  sifreGecerlimi,
};
