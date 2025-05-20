const { IncomingWebhook } = require("@slack/webhook")
const webHook = new IncomingWebhook(process.env.SLACK_WEBHOOK)

const loggerStream = {
  write: (message) => {
    webHook.send({ text: message.trim() }).catch(err => {
      console.error("Error enviando mensaje a Slack:", err);
    });
  }
};

module.exports = {
    loggerStream
};