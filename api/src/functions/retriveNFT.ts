import { Request, Response } from "express";
import {
  retriveNFTByContract,
  retriveNFTByWallet,
} from "../retriveNFT/retriveNFT";

export const nftWallet = async (Request: Request, Response: Response) => {
  const data = await retriveNFTByWallet();
  return Response.status(200).send(data);
};

export const nftContract = async (Request: Request, Response: Response) => {
  const data = await retriveNFTByContract();
  console.log(data);
  return Response.status(200).send(data);
};
