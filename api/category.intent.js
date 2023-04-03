const dialogflow = require("@google-cloud/dialogflow");
const intentsClient = new dialogflow.IntentsClient();
require("dotenv").config(); // Load the environment variables from .env file
const fs = require("fs");
const jsonData = fs.readFileSync("categories.json");
const categories = JSON.parse(jsonData);
console.log(categories);
async function createIntent() {
  const projectId = "nkb-porductpush";
  const agentPath = intentsClient.projectAgentPath(projectId);

  // Loop through each category
  //   const categories = [...new Set(data.map((product) => product.category))];
  // Loop through each category
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];

    // Initialize an intent object
    const intent = {
      displayName: `Product Inquiry - ${category.category}`,
      trainingPhrases: [],
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

    // Loop through each product in the category
    for (let j = 0; j < category.products.length; j++) {
      const product = category.products[j];

      // Construct the entity for each color and size
      const colorEntity = {
        value: `product_${product.color}`,
        synonyms: [product.color],
        entityType: `@product_color`,
      };
      const sizeEntity = {
        value: `product_${product.size}`,
        synonyms: [product.size],
        entityType: `@product_size`,
      };

      // Add each property of the product as an entity
      const entities = Object.keys(product).map((key) => {
        return {
          value: product[key],
          synonyms: [product[key]],
          entityType: `product_link`,
        };
      });

      console.log(entities);

      // Construct the training phrase with the entities
      const trainingPhrase = {
        type: "EXAMPLE",
        parts: [
          {
            text: `Product ${product.title} available in `,
          },
          {
            text: `${colorEntity.value} `,
            entityType: colorEntity.entityType,
          },
          {
            text: `color and `,
          },
          {
            text: `${sizeEntity.value} `,
            entityType: sizeEntity.entityType,
          },
          {
            text: `size for ${category.category}`,
          },
        ],
      };

      // Add the entities to the training phrase
      trainingPhrase.parts.push(
        ...entities.map((entity) => {
          return {
            text: ` ${entity.value}`,
            entityType: entity.entityType,
          };
        })
      );

      // Add the training phrase to the intent
      intent.trainingPhrases.push(trainingPhrase);

      // Add the entities to the agent
      const entityTypesClient = new dialogflow.EntityTypesClient();
      const [colorResponse] = await entityTypesClient.createEntityType({
        parent: agentPath,
        entityType: {
          displayName: `product_color`,
          kind: "KIND_MAP",
          autoExpansionMode: "AUTO_EXPANSION_MODE_UNSPECIFIED",
          entities: [colorEntity],
        },
      });
      const [sizeResponse] = await entityTypesClient.createEntityType({
        parent: agentPath,
        entityType: {
          displayName: `product_size`,
          kind: "KIND_MAP",
          autoExpansionMode: "AUTO_EXPANSION_MODE_UNSPECIFIED",
          entities: [sizeEntity],
        },
      });
      const responses = await Promise.all(
        entities.map((entity) => {
          return entityTypesClient.createEntityType({
            parent: agentPath,
            entityType: {
              displayName: `${entity.entityType}`,
              kind: "KIND_MAP",
              autoExpansionMode: "AUTO_EXPANSION_MODE_UNSPECIFIED",
              entities: [entity],
            },
          });
        })
      );
    }
  }
}

createIntent();
