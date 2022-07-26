import { connect } from "amqplib";

const amqp_url = process.env.CLOUDAMQP_URL || "amqp://localhost:5672";

export const produce = async () => {
  console.log("Publishing");
  const conn = await connect(amqp_url, "heartbeat=60");
  const ch = await conn.createChannel();
  const exch = "test_exchange";
  const q = "test_queue";
  const rkey = "test_route";
  const msg = "Hello World!";
  await ch
    .assertExchange(exch, "direct", { durable: true })
    .catch(console.error);
  await ch.assertQueue(q, { durable: true });
  await ch.bindQueue(q, exch, rkey);
  await ch.publish(exch, rkey, Buffer.from(msg));
  //   ch.close();
  //   conn.close();
  setTimeout(function () {
    ch.close();
    conn.close();
  }, 500);
};
export const do_consume = async () => {
  try {
    console.log("Conectando a fila");
    const conn = await connect(amqp_url);
    console.log("Conectado a fila");
    const ch = await conn.createChannel();
    const q = "test_queue";
    await ch.assertQueue(q, { durable: true });
    await ch.consume(
      q,
      function (msg: any) {
        console.log(msg.content.toString());
        ch.ack(msg);
        ch.cancel("myconsumer");
      },
      { consumerTag: "myconsumer" }
    );
    //   ch.close();
    //   conn.close();
    setTimeout(function () {
      ch.close();
      conn.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
};
