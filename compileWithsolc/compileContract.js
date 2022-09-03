const fs = require("fs");
const solc = require("solc");
const path = require("path");

const contractPath = path.join(__dirname, "..", "contracts/Mustache.sol");
const nodeModulesPath = path.join(__dirname, "..", "node_modules/");
const sources = {};
const readFile = (contractPath) => {
  //   sources[contractPath] = { content: fs.readFileSync(contractPath, "utf8") };

  //   console.log(sources[contractPath]);

  return fs.readFileSync(contractPath, "utf8");
};

const readContractImports = (file) => {
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
  const splitedPath = path.split("/");
  splitedPath.pop();
  return splitedPath.toString().replace(/,/g, "/");
};

const readOpenZeppelinDependencies = (OpenZeppelinDependencie) => {
  const readedOpenZeppelin = readFile(
    `${nodeModulesPath}${OpenZeppelinDependencie}`
  );
  const readOpenZeppelinImports = readContractImports(readedOpenZeppelin);
  console.log(
    `####### Dependencias do OpenZeppelin ${OpenZeppelinDependencie} ###########`
  );
  //   const splitedPath = OpenZeppelinDependencie.split("/");
  //   splitedPath.pop();
  //   mountPathOfInternalDependencies(OpenZeppelinDependencie);
  //   console.log("splitedPath", splitedPath.toString().replace(/,/g, "/"));
  readOpenZeppelinImports.map((fileDependencie) => {
    console.log(
      "dependencia",
      `${nodeModulesPath}${mountPathOfInternalDependencies(
        OpenZeppelinDependencie
      )}/${fileDependencie}`
    );

    // readOpenZeppelinDependencies(fileDependencie);
  });
  console.log("\n");
};

const init = () => {
  const readedFile = readFile(contractPath); //Aqui estou lendo meu contrato
  const contractimports = readContractImports(readedFile);
  console.log("Dependencias do meu contrato", contractimports);
  contractimports.map((contract) => readOpenZeppelinDependencies(contract)); //Aqui estou lendo as dependencias do contrato
};

init();
