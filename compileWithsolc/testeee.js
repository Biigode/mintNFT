const fs = require("fs");
let data = { teste: "This is a file containing a collection of books." };
let teste = JSON.stringify(data);
const init = () => {
  fs.writeFile("books.json", teste, (err) => {
    if (err) console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
      console.log(fs.readFileSync("books.json", "utf8"));
    }
  });
};

init();
