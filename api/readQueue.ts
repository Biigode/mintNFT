import { do_consume } from "./src/functions/rabbitMQ";

const readQueue = async () => {
  console.log("Lendo a fila");
  await do_consume();
  //   setTimeout(async () => {
  //     await do_consume();
  //   }, 10000);
  //   console.log("Aguardando proxima chamada em 10 seg");
};
readQueue();
