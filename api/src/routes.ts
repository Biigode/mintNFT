import express, { Request, Response, Router } from "express";
import { nftContract, nftWallet } from "./functions/retriveNFT";

const router = Router();


router.route("/nft-wallet").get((req: Request, res: Response) => nftWallet(req, res));
router.route("/nft-contract").get((req: Request, res: Response) => nftContract(req, res));

export default router;