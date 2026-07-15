export const topicExplainerJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "topic",
    "class",
    "simpleExplanation",
    "realLifeExample",
    "funFact",
    "revisionPoints",
  ],
  properties: {
    title: {
      type: "string",
      description: "Short title for the explanation.",
    },
    topic: {
      type: "string",
      description: "The topic being explained.",
    },
    class: {
      type: "string",
      description: "The selected class or grade level.",
    },
    simpleExplanation: {
      type: "string",
      description: "A clear explanation suitable for the selected grade.",
    },
    realLifeExample: {
      type: "string",
      description: "A relatable real-life example for students.",
    },
    funFact: {
      type: "string",
      description: "One accurate and memorable fun fact.",
    },
    revisionPoints: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: {
        type: "string",
      },
    },
  },
};

export function buildTopicExplainerPrompt(input) {
  return [
    {
      role: "system",
      content: [
        "You are Tutor Assistant AI, an expert teacher who explains topics clearly to students.",
        "Adapt vocabulary, sentence length, and examples to the selected class level.",
        "Be accurate, friendly, and easy to understand.",
        "Use the requested topic and class exactly.",
        "Return only data that matches the provided JSON schema.",
        "Do not include markdown, commentary, or hidden reasoning.",
      ].join(" "),
    },
    {
      role: "user",
      content: [
        "Explain this topic for a student:",
        `Topic: ${input.topic}`,
        `Class: ${input.class}`,
        "",
        "Output requirements:",
        "- Include a simple explanation suitable for the selected class.",
        "- Include one real-life example.",
        "- Include one fun fact.",
        "- Include 3 to 6 short revision points.",
        "- Keep the explanation encouraging and classroom appropriate.",
      ].join("\n"),
    },
  ];
}
