import axios from "axios";
import fs from "fs";
import readline from "readline";

const readEventsFromFile = (() => {
  const readableStream = fs.createReadStream("events.jsonl");

  const rl = readline.createInterface({
    input: readableStream,
    crlfDelay: Infinity,
  });

  rl.on("line", (line) => {
    const parsedEvent = JSON.parse(line);
    sendEvent(parsedEvent);
  });

  rl.on("close", () => {
    readableStream.close();
  });
})();
const sendEvent = (event) => {
  axios
    .post("http://localhost:8000/liveEvent", event, {
      headers: {
        Authorization: "secret",
      },
    })
    .catch((error) => {
      console.log("error");
    });
};
