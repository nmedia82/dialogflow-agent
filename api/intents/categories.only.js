const dialogflow = require("@google-cloud/dialogflow");
const intentsClient = new dialogflow.IntentsClient();
require("dotenv").config(); // Load the environment variables from .env file
const fs = require("fs");
const categories = require("./data.json");

async function createCategoryIntents() {
  const projectId = "nkb-porductpush";
  const agentPath = intentsClient.projectAgentPath(projectId);

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const displayName = `Product Inquiry - ${category.category}`;

    // create the intent
    const intent = {
      displayName: displayName,
      trainingPhrases: [
        {
          type: "EXAMPLE",
          parts: [{ text: `I am looking for ${category.category}` }],
        },
      ],
      messages: [
        {
          payload: {
            richContent: [
              [
                {
                  type: "info",
                  title: `${category.category} Products`,
                  subtitle: "Click a product to view more details",
                  rows: category.products.map((product) => {
                    return {
                      cells: [
                        {
                          type: "button",
                          text: product.title,
                          uri: product.link,
                        },
                      ],
                    };
                  }),
                },
              ],
            ],
          },
        },
      ],
    };

    console.log(JSON.stringify(intent.messages));

    // create the intent request
    const request = { parent: agentPath, intent: intent };

    try {
      const [response] = await intentsClient.createIntent(request);
      console.log(`Intent created: ${response.name}`);
    } catch (err) {
      console.error(err);
    }
  }
}

createCategoryIntents();
