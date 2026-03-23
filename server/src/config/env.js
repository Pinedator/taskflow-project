require('dotenv').config();
 
// Validación manual: si falta PORT el servidor se niega a arrancar
if (!process.env.PORT) {
  throw new Error('El puerto no está definido. Añade PORT en tu archivo .env');
}
 
module.exports = {
  PORT: process.env.PORT,
};