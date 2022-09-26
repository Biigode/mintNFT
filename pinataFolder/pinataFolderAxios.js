const fs = require("fs");
const FormData = require("form-data");
const rfs = require("recursive-fs");
const basePathConverter = require("base-path-converter");
const axios = require("axios");
const path = require("path");
require("dotenv").config();
const PINATA_JWT = process.env.JWT_PINATA;

const pinDirectoryToPinata = async () => {
  //   console.log(PINATA_JWT);
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const src = path.join(__dirname, "/largeFiles");
  // var status = 0;
  try {
    const { dirs, files } = await rfs.read(src);
    let data = new FormData();
    for (const file of files) {
      data.append(`file`, fs.createReadStream(file), {
        filepath: basePathConverter(src, file),
      });
    }

    // const response = await axios({
    //   url: "/pinFileToIPFS",
    //   method: "post",
    //   baseURL: "https://api.pinata.cloud/pinning",
    //   headers: {
    //     "X-Requested-With": "XMLHttpRequest",
    //     "Content-Type": "multipart/form-data;boundary=" + data.getBoundary(),
    //     authorization: `Bearer ${PINATA_JWT}`,
    //   },
    //   data,
    //   maxContentLength: Infinity,
    //   maxBodyLength: Infinity,
    // });

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "multipart/form-data;boundary=" + data.getBoundary(),
          authorization: `Bearer ${PINATA_JWT}`,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};
pinDirectoryToPinata();
