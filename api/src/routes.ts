import { Request, Response, Router } from "express";
import multer, { diskStorage } from "multer";
import { nftContract, nftWallet } from "./functions/retriveNFT";

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/downloads`);
  },
  filename: function (req, file, cb) {
    console.log(file);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname}`);
  },
});
const upload = multer({ storage: storage });
const router = Router();

router
  .route("/nft-wallet")
  .get((req: Request, res: Response) => nftWallet(req, res));
router
  .route("/nft-contract")
  .get((req: Request, res: Response) => nftContract(req, res));
router
  .route("/nft-upload")
  .post(upload.single("file"), (req: Request, res: Response) =>
    res.json({ up: "done" }).send()
  );

export default router;
