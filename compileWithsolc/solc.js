const fs = require("fs-extra");
const solc = require("solc");

const sourceFolderPath = path.join(
  __dirname,
  "..",
  "contracts/TestContract.sol"
);
const buildFolderPath = path.join(__dirname, "..", "build");

const getContractSource = (contractFileName) => {
  const contractPath = path.join(
    __dirname,
    "..",
    "contracts",
    contractFileName
  );
  //   console.log("path to contract", contractPath);
  return fs.readFileSync(contractPath, "utf8");
};

// let sources = {};

// var walk = function (dir) {
//   var results = [];
//   var list = fs.readdirSync(dir);
//   list.forEach(function (file) {
//     file = dir + "/" + file;
//     var stat = fs.statSync(file);
//     if (stat && stat.isDirectory()) {
//       results = results.concat(walk(file));
//     } else {
//       if (file.substr(file.length - 4, file.length) === ".sol") {
//         sources = {
//           ...sources,
//           [file]: {
//             content: getContractSource(file),
//           },
//         };
//       }
//       results.push(file);
//     }
//   });
//   return results;
// };
// walk(sourceFolderPath);
const instantiateContract = (baseContractPath) => {
  const pathToContract = getContractSource("TestContract.sol");
  console.log("Parsed contract", JSON.stringify(pathToContract));
  let sources = {};
  sources = {
    ...sources,
    [sourceFolderPath]: {
      content: pathToContract,
    },
  };

  const input = {
    language: "Solidity",
    sources,
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  console.log("\nCompiling contracts...");
  const output = JSON.parse(compile(JSON.stringify(input)));
  console.log("Done", output);

  const bytecode =
    "0x" + contract.contracts[baseContractPath]["Base"].evm.bytecode.object;
  const abi = contract.contracts[baseContractPath]["Base"].abi;

  return {
    bytecode: bytecode,
    abi: abi,
  };
};

const compileImports = (root, sources) => {
  sources[root] = { content: fs.readFileSync(root, "utf8") };
  const imports = getNeededImports(root);
  for (let i = 0; i < imports.length; i++) {
    compileImports(imports[i], sources);
  }
};

const getNeededImports = (path) => {
  const file = fs.readFileSync(path, "utf8");
  const files = new Array();
  file
    .toString()
    .split("\n")
    .forEach(function (line, index, arr) {
      if (
        (index === arr.length - 1 && line === "") ||
        !line.trim().startsWith("import")
      ) {
        return;
      }
      // the import is legit
      const relativePath = line.substring(8, line.length - 2);
      const fullPath = buildFullPath(path, relativePath);
      files.push(fullPath);
    });
  return files;
};

let shouldBuild = true;

if (output.errors) {
  console.error(output.errors);
  // throw '\nError in compilation please check the contract\n';
  for (error of output.errors) {
    if (error.severity === "error") {
      shouldBuild = false;
      throw "Error found";
      break;
    }
  }
}
const buildFullPath = (parent, path) => {
  let curDir = parent.substr(0, parent.lastIndexOf("/")); //i.e. ./node/.../ERC721
  if (path.startsWith("./")) {
    return curDir + "/" + path.substr(2);
  }

  while (path.startsWith("../")) {
    curDir = curDir.substr(0, curDir.lastIndexOf("/"));
    path = path.substr(3);
  }

  return curDir + "/" + path;
};

if (shouldBuild) {
  console.log("\nBuilding please wait...");


  fs.removeSync(buildFullPath);
  fs.ensureDirSync(buildFullPath);

  for (let contractFile in output.contracts) {
    for (let key in output.contracts[contractFile]) {
      fs.outputJsonSync(
        path.resolve(buildFullPath, `${key}.json`),
        {
          abi: output.contracts[contractFile][key]["abi"],
          bytecode:
            output.contracts[contractFile][key]["evm"]["bytecode"]["object"],
        },
        {
          spaces: 2,
          EOL: "\n",
        }
      );
    }
  }
  console.log("Build finished successfully!\n");
} else {
  console.log("\nBuild failed\n");
}
