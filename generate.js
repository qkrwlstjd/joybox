const { Configuration, OpenAIApi } = require("openai");
const OPENAI_API_KEY = "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";
const db = require("./db");

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
    //     message = `${message}
    // 제품이 있다면 제일 마지막줄에
    // [__,__,__]
    // 로 요약해줘`;
    await db.saveMessage(username, "user", message);
    const messages = await db.getMessage(username);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.5,
    });
    const resmsg = response.data.choices[0].message.content;
    await db.saveMessage(username, "assistant", resmsg);
    return createMsg(resmsg);
  } catch (error) {
    console.error(error);
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
  if (matches) {
    try {
      for (let i = 0; i < matches.length; i++) {
        n_msg = msg.replace(matches[i], "");
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
          let a_tag = `<a href='https://www.coupang.com/np/search?lptag=AF3521584&component=&channel=user&q=${item_array[j]}'>${item_array[j]}</a>`;
          new_array[i] = new_array[i].replace(item_array[j], a_tag);
        }
      }
    }
  }
  n_msg = new_array.join("<br>");
  return n_msg;
}

module.exports = { generateResponse, createMsg };
