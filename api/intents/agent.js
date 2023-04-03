const dialogflow = require("@google-cloud/dialogflow");
require("dotenv").config(); // Load the environment variables from .env file

// Instantiates a session client
const sessionClient = new dialogflow.SessionsClient();

// Replace with your own project ID
const projectId = "nkb-porductpush";
const sessionId = "123456";
// const query = "I want to buy t-shirt";

async function detectIntent(query, sessionId) {
  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: "en-US",
      },
    },
  };

  // Send the request for intent detection
  const responses = await sessionClient.detectIntent(request);
  //   console.log("Detected intent:");
  //   console.log(responses);
  //   console.log(responses[0].queryResult.intent.displayName);
  return responses;
}

module.exports = detectIntent;
