const startTimestamp = Date.now();
const ethers = require("ethers");
// const config = require("./config.json");
// const fs = require("fs-extra");

let compiled = require("../compileContract.json");
const provider = ethers.getDefaultProvider("rinkeby");

const wallet = new ethers.Wallet(
  "ccbb0c118d62d780402875752e5825ecc9cec75a50fd91074e0774b8be4d6660",
  provider
);
console.log(`Loaded wallet ${wallet.address}`);

(async () => {
  console.log(`\nDeploying in rinkeby...`);
  let contract = new ethers.ContractFactory(
    compiled.abi,
    compiled.bytecode,
    wallet
  );

  let instance = await contract.deploy();
  console.log(`deployed at ${instance.address}`);
  // config[`${process.argv[2]}`] = instance.address;
  console.log("Waiting for the contract to get mined...");
  await instance.deployed();
  console.log("Contract deployed");
  // fs.outputJsonSync("config.json", config, {
  //   spaces: 2,
  //   EOL: "\n",
  // });
})();
