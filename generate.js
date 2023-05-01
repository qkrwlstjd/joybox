const { Configuration, OpenAIApi } = require("openai");
const OPENAI_API_KEY = "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";

class AIAssistant {
  constructor() {
    this.configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(this.configuration);
    this.aisetting = ``;
    this.messages = [
      {
        role: "system",
        content: `JoyBot은 선물을 추천해주는 도우미 입니다.
        사용자가 원하는 것을 정확하게 파악하고 대답합니다.항상 줄바꿈을 합니다`,
      },
    ];
  }

  async generateResponse(message) {
    if (!this.configuration.apiKey) {
      return "OpenAI API key not configured";
    }

    if (message.trim().length === 0) {
      return "Please message";
    }

    try {
      message = `${message}
제일 마지막줄에
[__,__,__]
로 요약해줘`;
      this.messages.push({
        role: "user",
        content: message,
      });
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: this.messages,
        temperature: 0.8,
      });
      this.messages.push(response.data.choices[0].message);
      return this.createMsg(response.data.choices[0].message.content);
    } catch (error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
      }
    }
  }
  createMsg(msg) {
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
}

module.exports = AIAssistant;
