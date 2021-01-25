var bcrypt = require("bcryptjs");

export async function hashCrypt(text) {
  const salt = await bcrypt.genSalt(8);
  return bcrypt.hash(text, salt, null);
}
