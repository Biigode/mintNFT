import { rarityWeights } from "../input/config";

// creates dnaList object by rarity
export const createDnaListByRarity = (rarityWeightsArray: Array<any>) => {
  const dnaListByRarity: Array<any> = [];

  rarityWeightsArray.forEach((rarityWeight) => {
    dnaListByRarity[rarityWeight.value] = [];
  });

  return dnaListByRarity;
};

// gets random rarity
export const getRandomRarity = (_rarityOptions: Array<any>) => {
  let randomPercent = Math.random() * 100;
  let percentCount = 0;

  for (let i = 0; i <= _rarityOptions.length; i++) {
    percentCount += _rarityOptions[i].percent;
    if (percentCount >= randomPercent) {
      console.log(`use random rarity ${_rarityOptions[i].id}`);
      return _rarityOptions[i].id;
    }
  }
  return _rarityOptions[0].id;
};

// get the rarity for the image by edition number that should be generated
export const getRarity = (_editionCount: number, editionSize: number) => {
  let rarityForEdition: any;

  if (!rarityForEdition) {
    // prepare array to iterate over
    rarityForEdition = [];
    rarityWeights.forEach((rarityWeight) => {
      for (let i = rarityWeight.from; i <= rarityWeight.to; i++) {
        rarityForEdition.push(rarityWeight.value);
      }
    });
  }
  return rarityForEdition[editionSize - _editionCount];
};
