const { Configuration, OpenAIApi } = require('openai');
const OPENAI_API_KEY = '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';

class AIAssistant {
  constructor() {
    this.configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(this.configuration);
    this.category = [
        '여성패션',
        '남성패션',
        '남여 공용 의류',
        '유아동패션',
        '뷰티',
        '출산/유아동',
        '가전디지털',
        '스포츠/레저',
        '자동차용품',
        '도서/음반/CD',
        '완구/취미',
        '문구/오피스',
        '반려동물용품',
        '헬스/건강식품',
        '국내여행',
        '해외여행'
    ]
    this.aisetting = `다음은 AI 세일즈맨과의 대화입니다.
    AI 세일즈맨 사용자가 원하는 것을 정확하게 파악하고 짧고 간결하게 대답합니다`;
    this.messages = [
    //   '안녕, 누구세요?',
    //   '저는 OpenAI가 만든 AI입니다. 무엇을 도와드릴까요?',
    ];
  }

  async generateResponse(message) {
    if (!this.configuration.apiKey) {
      throw "OpenAI API key not configured";
    }

    if (message.trim().length === 0) {
      throw "Please message";
    }

    try {
      this.saveMessage(message);
      const prompt=this.generatePrompt(this.messages)
      const completion = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.8,
        max_tokens:2000,
      });
      this.saveMessage(completion.data.choices[0].text);

      const prompt2=this.itemPrompt(prompt+completion.data.choices[0].text)
      const completion2 = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt2,
        temperature: 0,
        max_tokens:2000,
      });
      return {"chat":completion.data.choices[0].text,"result":completion2.data.choices[0].text};
    } catch (error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
      }
    }
  }

  saveMessage(message) {
    this.messages.push(message);
  }

  generatePrompt(messages) {
    let message = this.aisetting;
    let who='';
    for (let i = 0; i < messages.length; i++) {
      if (i % 2 == 0) {
        who = "사용자";
      } else {
        who = "AI";
      }
      message = `${message}\n${who}: ${messages[i]}`
    }
    message = `${message}\nAI세일즈맨: `
    console.log(`\n\n\n대화 ${parseInt(messages.length/2)+1}\n${message}`);
    return message;
  }

  itemPrompt(prompt) {
    let message = `AI는 다음의 대화를 통해 세일즈맨이 어떤 제품을 추천해줄지 찾아냅니다.
    대답은 반드시 '${this.category.join(', ')}' 중에서 선택해야합니다.
    ${prompt}
    이 대화에서 세일즈맨이 추천해주는 제품의 카테고리는 어떤것일까요?`
    console.log(`\n\n${message}`)
    return message;
  }
}

module.exports = AIAssistant;
