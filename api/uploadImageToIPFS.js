const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
require("dotenv").config();
const AUTHORIZATION = process.env.AUTHORIZATION;


const form = new FormData();
const fileStream = fs.createReadStream(
  "/home/victorf/projects/ABI-NFT/mintNFT/api/mustache.jpg"
);
form.append("file", fileStream);

const uploadToIPFS = async () => {
  try {
    const requestParams = {
      method: "POST",
      url: "https://api.nftport.xyz/v0/files",
      body: form,
      headers: {
        Authorization: AUTHORIZATION,
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await axios.post(requestParams.url, form, {
      headers: {
        Authorization: AUTHORIZATION,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

uploadToIPFS();
