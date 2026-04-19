import dotenv from "dotenv";
import app from "./app";
import { connectDatabase } from "./config/db";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const bootstrap = async (): Promise<void> => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

void bootstrap();
