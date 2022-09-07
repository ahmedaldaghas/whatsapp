const { Client, LocalAuth } = require("whatsapp-web.js");
const { selectLists } = require("./functions/ResponList");
const { selectChat } = require("./functions/ResponChat");
const pm2 = require("pm2");

require("dotenv").config();

const args = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-accelerated-2d-canvas",
  "--no-first-run",
  "--no-zygote",
  "--single-process",
  "--disable-gpu",
];

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { args: args, headless: true },
});

client.initialize().catch(() => pm2.restart("inedx"));

client.on("ready", () => {
  console.log("Client is ready!");
});
//delete require.cache[require.resolve("./functions/SendButtons")]
client.on("message", async (msg) => {
  try {
    switch (msg.type) {
      case "list_response":
        client.sendMessage(msg.from, await selectLists(msg.selectedRowId), {
          linkPreview: false,
        });
        break;
      case "chat":
        client.sendMessage(msg.from, await selectChat(msg.body, msg.from), {
          linkPreview: false,
        });
        break;
      case "e2e_notification":
        client.sendMessage(
          msg.from,
          "Hello you have been registered Successfully \n\n please send a number now from 1 to 9"
        );
        break;
    }
    // console.log(msg.type, msg.body);
  } catch (err) {
    console.log(err);
    client.sendMessage(
      "97333959459@c.us",
      `${err.message}\nFrom: ${msg.from}\n\n\n${msg.body}`
    );
    client.sendMessage(
      msg.from,
      "*Error Reported*\nContact:\nAkaa: https://wa.me/97333959459\nAli Redha: https://wa.me/97338406875"
    );
  }
});
