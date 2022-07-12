const axios = require("axios");
require("dotenv").config();
const AUTHORIZATION = process.env.AUTHORIZATION;
const OWNER = process.env.PUBLIC_KEY;

let options = {
  method: "POST",
  url: "https://api.nftport.xyz/v0/contracts",
  headers: { "Content-Type": "application/json", Authorization: AUTHORIZATION },
  data: {
    chain: "rinkeby",
    name: "Mustache contract",
    symbol: "MC",
    owner_address: OWNER,
    metadata_updatable: false,
    type: "erc721",
    roles: [
      {
        role: "mint",
        addresses: [OWNER],
        freeze: false,
      },
    ],
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
