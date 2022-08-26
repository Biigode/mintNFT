import jsonServer from "json-server";
import dbJson from "./db.json";
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get("/home", (req, res) => {
  res.json(dbJson.manageCampaigns);
});

server.use(jsonServer.bodyParser);

server.listen(3111, () => {
  console.log("JSON Server is running in port 3111");
});
