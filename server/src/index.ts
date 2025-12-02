import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/db.js";
import router from "./routes/route.js";

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

connectDB().then(() => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
