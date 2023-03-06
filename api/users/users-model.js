/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */

const db = require("../../data/db-config");
async function bul() {
  // return db("users").select("user_id", "username");

  let allUsers = await db("users");
  let responseListUsers = allUsers.map((user) => {
    return { user_id: user.user_id, username: user.username };
  });
  return responseListUsers;
}

/**
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
 */
async function goreBul(filtre) {
  let filtedeUserList = await db("users")
    .where(filtre)
    .map((user) => {
      return { user_id: user.user_id, username: user.username };
    });
  return filtedeUserList;
}

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
async function idyeGoreBul(user_id) {
  let user = await db("users").where({ user_id }).first();
  return { user_id: user.user_id, username: user.username };
}

/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
// function ekle(user) {
//   return db("users")
//     .insert(user)
//     .then((ids) => {
//       return idyeGoreBul(ids[0]);
//     });
// }

async function ekle(user) {
  const newUserId = await db("users").insert(user);
  const newUser = await idyeGoreBul(newUserId);
  return {
    user_id: newUser.user_id,
    username: newUser.username,
  };
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = {
  bul,
  goreBul,
  idyeGoreBul,
  ekle,
};
