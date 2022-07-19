import fs from "fs";

import { Canvas, CanvasRenderingContext2D } from "canvas";

// import canvas
import { drawBackground, drawElement, loadLayerImg, signImage } from "./canvas";

// import dna
import { constructLayerToDna, createUniqueDna } from "./dna";

// import rarity
import { getRarity } from "./rarity";

const constructLoadedElements = (
  layers: Array<any>,
  editionCount: number,
  editionSize: number,
  rarityWeights: any,
  dnaListByRarity: Array<any>
) => {
  interface IDna {
    loadedElements: Array<any>;
    newDna: Array<any> | null;
  }
  let dna: IDna = {
    loadedElements: [],
    newDna: null,
  };

  // holds which dna has already been used during generation and prepares dnaList object
  // const dnaListByRarity = createDnaListByRarity(rarityWeights);

  // get rarity from to config to create NFT as
  let rarity = getRarity(editionCount, editionSize);
  // create unique Dna
  dna.newDna = createUniqueDna(layers, rarity, rarityWeights, dnaListByRarity);
  dnaListByRarity[rarity].push(dna.newDna);
  console.log(dnaListByRarity);

  // propagate information about required layer contained within config into a mapping object
  // = prepare for drawing
  let results = constructLayerToDna(dna.newDna, layers, rarity);

  // load all images to be used by canvas
  results.forEach((layer) => {
    dna.loadedElements.push(loadLayerImg(layer));
  });

  return dna;
};

// create image files and return back image object array
export const createFile = async (
  canvas: Canvas,
  ctx: CanvasRenderingContext2D,
  layers: Array<any>,
  width: number,
  height: number,
  editionCount: number,
  editionSize: number,
  rarityWeights: Array<any>,
  imageDataArray: Array<any>,
  dnaListByRarity: Array<any>
) => {
  const dna = constructLoadedElements(
    layers,
    editionCount,
    editionSize,
    rarityWeights,
    dnaListByRarity
  );

  let attributesList: Array<any> = [];

  await Promise.all(dna.loadedElements).then((elementArray) => {
    // create empty image
    ctx.clearRect(0, 0, width, height);
    // draw a random background color
    drawBackground(ctx, width, height);
    // store information about each layer to add it as meta information
    attributesList = [];
    // draw each layer
    elementArray.forEach((element) => {
      drawElement(ctx, element);
      let selectedElement = element.layer.selectedElement;
      attributesList.push({
        name: selectedElement.name,
        rarity: selectedElement.rarity,
      });
    });
    // add an image signature as the edition count to the top left of the image
    signImage(ctx, `#${editionCount}`);
    // write the image to the output directory
  });

  let filename = editionCount.toString() + ".png";

  // save locally as file
  fs.writeFileSync(`${__dirname}/output/${filename}`, canvas.toBuffer()); //canvas.toBuffer(filetype)
  console.log(`Created #${editionCount.toString()}`);

  imageDataArray[editionCount] = {
    editionCount: editionCount,
    newDna: dna.newDna,
    attributesList: attributesList,
  };

  return imageDataArray;
};
