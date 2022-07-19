const fs = require("fs");

const readFile = async () => {
  console.log("vou ter o json");
  const fsPromise = new Promise((res, rej) => {
    fs.readFile(`${__dirname}/_metadata.json`, (err, data) => {
      if (err) rej();
      res(data);
    });
  });
  const fsPromiseResolved = await fsPromise;
  console.log(JSON.parse(fsPromiseResolved));
  console.log("terminei de ler o json");
};

readFile();
