const { Configuration, OpenAIApi } = require("openai");
const OPENAI_API_KEY = "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";
const db = require("./db");
const CHAT_LIMIT = 20;
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
async function generateResponse(username, message) {
  if (!configuration.apiKey) {
    return "OpenAI API key not configured";
  }

  if (message.trim().length === 0) {
    return "Please message";
  }

  try {
    message = `${message}
    제품이 있다면 제일 마지막줄에
    [__,__,__]
    로 요약해줘`;
    await db.saveMessage(username, "user", message, 0);
    let messages = await db.getMessage(username, CHAT_LIMIT);
    while (getByteSize(messages) / 2 > 2000) {
      messages.splice(1, 2);
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.5,
      max_tokens: 2000,
    });
    const resmsg = response.data.choices[0].message.content;
    await db.saveMessage(
      username,
      "assistant",
      resmsg,
      response.data.usage.total_tokens
    );
    return createMsg(resmsg);
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
}
function createMsg(msg) {
  let n_msg = "";
  let new_array = [];
  let item_array = [];

  const regex = /\[(.*?)\]/g;
  const matches = msg.match(regex);
  let coopang = false;
  if (matches) {
    try {
      for (let i = 0; i < matches.length; i++) {
        console.log(matches[i]);
        n_msg = msg.replaceAll(matches[i], "");
        item_array = item_array.concat(
          matches[i]
            .replace("등", "")
            .replace("추천", "")
            .replace("  ", "")
            .replace("[ ", "")
            .replace("[", "")
            .replace(" ]", "")
            .replace("]", "")
            .split(",")
        );
      }
      new_array = n_msg.replace("\n\n", "\n").split("\n");
    } catch (e) {
      console.log(e);
    }
  } else {
    n_msg = msg;
    new_array = n_msg.replace("\n\n", "\n").split("\n");
  }
  if (item_array) {
    for (let i = 0; i < new_array.length; i++) {
      for (let j = 0; j < item_array.length; j++) {
        if (new_array[i].indexOf(item_array[j]) !== -1) {
          coopang = true;
          let a_tag = `<a href='https://www.coupang.com/np/search?lptag=AF3521584&component=&channel=user&q=${item_array[j]}'>${item_array[j]}</a>`;
          new_array[i] = new_array[i].replace(item_array[j], a_tag);
        }
      }
    }
  }
  if (coopang) {
    new_array.push(
      "<br><br>Joybot은 쿠팡파트너스 활동을 통해 일정액의 수수료를 제공받을 수 있습니다."
    );
  }
  n_msg = new_array.join("<br>");
  return n_msg;
}
function getByteSize(array) {
  const str = array.map((obj) => JSON.stringify(obj)).join(", ");
  const byteSize = Buffer.byteLength(str, "utf8");

  return byteSize;
}

module.exports = { generateResponse, createMsg };
