const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");
const detectIntent = require("./intents/agent");

require("dotenv").config(); // Load the environment variables from .env file

// console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const app = express();

app.use(cors());
// Middleware to parse incoming requests as JSON
app.use(bodyParser.json());

// app.post("/get-answer", async (req, res) => {
//   const query = req.body.message;
//   const sessionId = "ceo@najeebmedia.com";
//   const response = await detectIntent(query, sessionId);
//   res.json(response);
// });

app.post("/get-answer", async (req, res) => {
  try {
    const query = req.body.message;
    const sessionId = "najeeb";
    const response = await detectIntent(query, sessionId);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error occurred");
  }
});

// Route to handle Dialogflow requests
app.post("/dialogflow", async (req, res) => {
  // Create a new session ID for each request
  const sessionId = uuid.v4();

  // Initialize a new Dialogflow session client
  const sessionClient = new dialogflow.SessionsClient();

  // Set the project ID and session ID
  const projectId = "nkb-porductpush";
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  //   console.log(req.body);
  // Get the text query from the request
  const query = req.body.message;

  // Construct the Dialogflow query request
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: "en-US",
      },
    },
  };

  try {
    // Send the query request to Dialogflow
    const responses = await sessionClient.detectIntent(request);

    // Get the first response from Dialogflow
    const result = responses[0].queryResult;

    // Construct the response object
    const response = {
      fulfillmentText: result.fulfillmentText,
    };

    // Send the response back to Dialogflow
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
