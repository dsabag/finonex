import express from "express";
import fs from "fs";
import pg from "pg";

const client = new pg.Client({
  database: "finonex",
  user: "postgres",
  password: "admin",
});
await client.connect();

const app = express();
const PORT = 8000;

app.use(express.json());

app.use("/liveEvent", (req, res, next) => {
  const authHeader = req.header("Authorization");
  authHeader === "secret" ? next() : res.sendStatus(403);
});

app.post("/liveEvent", (req, res) => {
  writeEventsToFile(req.body);
  res.sendStatus(200);
});

app.get("/userEvents/:userid", async (req, res) => {
  console.log(req.params.userid);
  const respone = await client.query(
    `SELECT * FROM users_revenue WHERE user_id = '${req.params.userid}'`
  );
  res.send(respone.rows[0]);
});

const writeEventsToFile = (event) => {
  const convertedEvent = JSON.stringify(event);
  const stream = fs.createWriteStream("server_events.jsonl", { flags: "a" });
  stream.write(convertedEvent + "\n");
  stream.end();
};

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running,and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
