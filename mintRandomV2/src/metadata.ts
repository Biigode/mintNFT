import fs from "fs";
import Moralis from "moralis/node";

import { baseImageUri, description } from "../input/config";

// write metadata locally to json files
export const writeMetaData = (metadataList: Array<any>) => {
  fs.writeFileSync(
    `${__dirname}/output/_metadata.json`,
    JSON.stringify(metadataList)
  );
};

// add metadata for individual nft edition
export const generateMetadata = (
  dna: any,
  edition: string,
  attributesList: string,
  path: string
) => {
  let dateTime = Date.now();
  let tempMetadata = {
    dna: dna.join(""),
    name: `#${edition}`,
    description: description,
    image: path || baseImageUri,
    edition: edition,
    date: dateTime,
    attributes: attributesList,
  };
  return tempMetadata;
};

// upload metadata
export const uploadMetadata = async (
  editionSize: number,
  imageDataArray: Array<any>
) => {
  const ipfsArray = []; // holds all IPFS data
  const metadataList = []; // holds metadata for all NFTs (could be a session store of data)
  const promiseArray = []; // array of promises so that only if finished, will next promise be initiated

  for (let i = 1; i < editionSize + 1; i++) {
    let id = i.toString();
    let paddedHex = (
      "0000000000000000000000000000000000000000000000000000000000000000" + id
    ).slice(-64);
    let filename = i.toString() + ".json";

    let nftMetadata = generateMetadata(
      imageDataArray[i].newDna,
      imageDataArray[i].editionCount,
      imageDataArray[i].attributesList,
      imageDataArray[i].filePath
    );
    metadataList.push(nftMetadata);

    // upload metafile data to Moralis
    const metaFile = new Moralis.File(filename, {
      base64: Buffer.from(
        JSON.stringify(metadataList.find((meta: any) => meta.edition == i))
      ).toString("base64"),
    });

    // save locally as file
    fs.writeFileSync(
      `${__dirname}/output/${filename}`,
      JSON.stringify(metadataList.find((meta: any) => meta.edition == i))
    );

    // reads output folder for json files and then adds to IPFS object array
    promiseArray.push(
      new Promise((res, rej) => {
        fs.readFile(`${__dirname}/output/${id}.json`, (err, data) => {
          if (err) rej();
          ipfsArray.push({
            path: `metadata/${paddedHex}.json`,
            content: data.toString("base64"),
          });
          res(null);
        });
      })
    );
  }
  writeMetaData(metadataList);
};

// compile metadata (reads output folder images)
export const compileMetadata = async (
  editionCount: any,
  editionSize: any,
  imageDataArray: any
) => {
  const ipfsArray = [];
  const promiseArray = [];

  for (let i = 1; i < editionCount; i++) {
    let id = i.toString();
    let paddedHex = (
      "0000000000000000000000000000000000000000000000000000000000000000" + id
    ).slice(-64);

    // reads output folder for images and adds to IPFS object metadata array (within promise array)
    promiseArray.push(
      new Promise((res, rej) => {
        fs.readFile(`${__dirname}/output/${id}.png`, (err, data) => {
          if (err) rej();
          ipfsArray.push({
            path: `images/${paddedHex}.png`,
            content: data.toString("base64"),
          });
          res(null);
        });
      })
    );
  }
  uploadMetadata(editionSize, imageDataArray);
};
