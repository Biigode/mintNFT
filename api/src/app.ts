import cors from "cors";
import express from "express";
import routes from "./routes";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/nft", routes);

app.listen(3000, () => {
  console.log("NFT API UP IN PORT 3000");
});

export default app;
