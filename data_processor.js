import readline from "readline";
import fs from "fs";
import pg from "pg";

const client = new pg.Client({
  database: "finonex",
  user: "postgres",
  password: "admin",
});
await client.connect();

const readEventsFromFile = (() => {
  const readableStream = fs.createReadStream("server_events.jsonl");

  const rl = readline.createInterface({
    input: readableStream,
    crlfDelay: Infinity,
  });

  rl.on("line", async (line) => {
    const parsedLine = JSON.parse(line);
    if (!parsedLine.name || !parsedLine.value || parsedLine.user_id)
      return false;
    let query = "";
    let values = "";

    await client.query("BEGIN");
    if (parsedLine.name == "add_revenue") {
      query =
        "UPDATE users_revenue SET revenue = revenue + $1 WHERE user_id = $2";
      values = [parsedLine.value, parsedLine.userId];
    } else if (parsedLine.name == "subtract_revenue") {
      query =
        "UPDATE users_revenue SET revenue = revenue - $1 WHERE user_id = $2";
      values = [parsedLine.value, parsedLine.userId];
    }
    const res = await client.query(query, values);
    await client.query("COMMIT");
  });
})();
