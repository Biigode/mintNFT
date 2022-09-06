const fs = require("fs");
const solc = require("solc");
const path = require("path");
const smtchecker = require("solc/smtchecker");
const smtsolver = require("solc/smtsolver");

const contractPath = path.join(__dirname, "..", "contracts/Mustache.sol");
const nodeModulesPath = path.join(__dirname, "..", "node_modules/");
const sources = {};
const paths = [];
let pathsToImport = [];
const readFile = (contractPath) => {
  paths.push(contractPath);
  const fileReaded = fs.readFileSync(contractPath, "utf8");
  sources[contractPath] = { content: fileReaded };
  return fileReaded;
};

const readContractImports = (file) => {
  //recebo um arquivo
  const contractImports = [];
  file
    .toString()
    .split("\n")
    .forEach(function (line, index, fullFile) {
      if (
        (index === fullFile.length - 1 && line === "") ||
        !line.trim().startsWith("import")
      ) {
        //"Not a import"
        return;
      }
      const contractImport = line.substring(8, line.length - 2);
      contractImports.push(contractImport);
    });
  return contractImports;
};

const mountPathOfInternalDependencies = (path) => {
  // monta o caminho interno
  const splitedPath = path.split("/");
  splitedPath.pop();
  return splitedPath.toString().replace(/,/g, "/");
};

const readOpenZeppelinDependencies = (PathToOpenZeppelinDependencie) => {
  //Leio das dependencias do contrato
  const readedOpenZeppelin = readFile(PathToOpenZeppelinDependencie);
  console.log("paths", PathToOpenZeppelinDependencie);
  const readOpenZeppelinImports = readContractImports(readedOpenZeppelin);

  console.log("Lendo dependencia => ", PathToOpenZeppelinDependencie);
  console.log("Dependencias internas =>", readOpenZeppelinImports);

  readOpenZeppelinImports.map((fileDependencie) => {
    console.log("lendo => ", fileDependencie);

    const pathToCurrentFile = `${mountPathOfInternalDependencies(
      PathToOpenZeppelinDependencie
    )}/${fileDependencie}`;
    console.log(pathToCurrentFile);
    const testeLido = readFile(pathToCurrentFile);
    const dependenciaDaDependencia = readContractImports(testeLido);
    if (dependenciaDaDependencia.length) {
      console.log("Tem dependencia interna", dependenciaDaDependencia);
      readOpenZeppelinDependencies(pathToCurrentFile);
    }
  });

  console.log("\n");
};

function findImports(imports) {
  const parsed = imports.split("/");
  const currentImport = parsed[parsed.length - 1];

  //my imported sources are stored under the node_modules folder!
  const source = pathsToImport.filter((relativeDependencie, index) => {
    if (relativeDependencie.includes(currentImport)) {
      return relativeDependencie;
    }
  });

  const source3 = fs.readFileSync(source[0], "utf8");

  return { contents: source3 };
}

const init = () => {
  const readedFile = readFile(contractPath); //Aqui estou lendo meu contrato
  const contractimports = readContractImports(readedFile);
  console.log("Dependencias do meu contrato", contractimports);
  contractimports.map((contractDependencie) =>
    readOpenZeppelinDependencies(`${nodeModulesPath}${contractDependencie}`)
  ); //Aqui estou lendo as dependencias do contrato

  let input = {
    language: "Solidity",
    sources: sources,
    settings: {
      modelChecker: {
        engine: "chc",
        solvers: ["smtlib2"],
      },
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  pathsToImport = [...new Set(paths)];
  console.log(pathsToImport);
  const output = solc.compile(JSON.stringify(input), { import: findImports });
  const contract = JSON.parse(output);
  console.log(contract);

  const bytecode =
    "0x" + contract.contracts[contractPath]["Base"].evm.bytecode.object;
  const abi = contract.contracts[contractPath]["Base"].abi;
  // return {
  //   bytecode: bytecode,
  //   abi: abi,
  // };
};

init();
