const teste = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("foo");
    }, 2000);
  });
};

(async () => {
  console.log("antes da promise");
  teste()
    .then((e) => {
      console.log("no then", e);
      return;
    })
    .catch((e) => {
      console.log("no catch", e);
      return;
    });
  console.log("depois da promise");
})();
