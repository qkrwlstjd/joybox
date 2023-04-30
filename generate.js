const { Configuration, OpenAIApi }=require('openai');
const OPENAI_API_KEY = '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';
const ORGANIZATION_NAME= 'org-Gy47EaAkWjBWv1FR3gTvJO6A'

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateResponse(message) {
  if (!configuration.apiKey) {
    throw "OpenAI API key not configured"
  }

  if (message.trim().length === 0) {
    throw "Please message"
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-001",
      prompt: generatePrompt(message),
      temperature: 1,
    });
    return completion.data.choices[0].text
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
}

function generatePrompt(message) {
    return message
}

module.exports = generateResponse;
