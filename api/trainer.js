const dialogflow = require("@google-cloud/dialogflow");
const intentsClient = new dialogflow.IntentsClient();
require("dotenv").config(); // Load the environment variables from .env file
const fs = require("fs");
const jsonData = fs.readFileSync("data.json");
const data = JSON.parse(jsonData);

async function createIntent() {
  const projectId = "nkb-porductpush";
  const agentPath = intentsClient.projectAgentPath(projectId);

  const intent = {
    displayName: "Product Inquiry",
    trainingPhrases: [],
    messages: [{ text: { text: [""] } }],
  };

  for (let i = 0; i < data.length; i++) {
    const product = data[i];
    const attributes = `${product.color}, ${product.size}`;
    const category = `${product.category}`;
    const trainingPhrase = {
      type: "EXAMPLE",
      parts: [
        {
          text: `Product ${product.name} available in ${attributes} and ${category}.`,
        },
      ],
    };

    // Add each property of the product as an entity
    Object.keys(product).forEach((key) => {
      trainingPhrase.parts.push({
        text: product[key],
        entityType: `@${key}`,
      });
    });

    intent.trainingPhrases.push(trainingPhrase);
  }

  const request = {
    parent: agentPath,
    intent: intent,
  };

  try {
    const [response] = await intentsClient.createIntent(request);
    console.log(`Intent created: ${response.name}`);
  } catch (err) {
    console.error(err);
  }
}

createIntent();
