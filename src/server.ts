import app from './app';
import { connectDB } from './config/database';
import dotenv from 'dotenv';
dotenv.config();

const PORT = Number(process.env.PORT || 4000);

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
})();
