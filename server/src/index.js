require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
require("./config/firebaseAdmin");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    console.log("✅ MongoDB conectado correctamente");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(` Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error iniciando servidor:");
    console.error(error);
    process.exit(1);
  }
}

startServer();