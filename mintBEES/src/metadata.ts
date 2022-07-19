import fs from "fs";

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
  return {
    dna: dna.join(""),
    name: `#${edition}`,
    description: description,
    image: path || baseImageUri,
    edition: edition,
    date: dateTime,
    attributes: attributesList,
  };
};

// upload metadata
export const saveMetadata = async (
  editionSize: number,
  imageDataArray: Array<any>
) => {
  const metadataList = []; // holds metadata for all NFTs (could be a session store of data)

  for (let i = 1; i < editionSize + 1; i++) {
    const filename = i.toString() + ".json";

    let nftMetadata = generateMetadata(
      imageDataArray[i].newDna,
      imageDataArray[i].editionCount,
      imageDataArray[i].attributesList,
      imageDataArray[i].filePath
    );
    metadataList.push(nftMetadata);

    // save locally as file
    fs.writeFileSync(
      `${__dirname}/output/${filename}`,
      JSON.stringify(metadataList.find((meta: any) => meta.edition == i))
    );

    writeMetaData(metadataList);
  }
};
