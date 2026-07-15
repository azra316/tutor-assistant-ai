export const quizJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "class",
    "subject",
    "topic",
    "difficulty",
    "numberOfQuestions",
    "instructions",
    "questions",
    "answerKey",
  ],
  properties: {
    title: {
      type: "string",
      description: "Short quiz title.",
    },
    class: {
      type: "string",
      description: "The target class or grade level.",
    },
    subject: {
      type: "string",
      description: "The subject area.",
    },
    topic: {
      type: "string",
      description: "The quiz topic.",
    },
    difficulty: {
      type: "string",
      description: "The requested difficulty level.",
    },
    numberOfQuestions: {
      type: "integer",
      description: "Total number of questions generated.",
    },
    instructions: {
      type: "array",
      minItems: 2,
      maxItems: 4,
      items: {
        type: "string",
      },
    },
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["number", "type", "prompt", "choices", "points"],
        properties: {
          number: {
            type: "integer",
          },
          type: {
            type: "string",
            enum: ["multiple_choice", "true_false", "fill_blank", "short_answer"],
          },
          prompt: {
            type: "string",
            description: "Student-facing question text.",
          },
          choices: {
            type: "array",
            description: "Exactly four choices for multiple choice questions; empty for other types.",
            items: {
              type: "string",
            },
          },
          points: {
            type: "integer",
          },
        },
      },
    },
    answerKey: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["number", "answer", "explanation"],
        properties: {
          number: {
            type: "integer",
          },
          answer: {
            type: "string",
          },
          explanation: {
            type: "string",
          },
        },
      },
    },
  },
};

export function buildQuizPrompt(input) {
  return [
    {
      role: "system",
      content: [
        "You are Tutor Assistant AI, an expert assessment designer for teachers.",
        "Generate classroom-ready quizzes that are accurate, age-appropriate, and aligned to the requested topic.",
        "Use the requested class, subject, topic, difficulty, and question count exactly.",
        "Return only data that matches the provided JSON schema.",
        "Do not include markdown, commentary, or hidden reasoning.",
      ].join(" "),
    },
    {
      role: "user",
      content: [
        "Create a balanced quiz with these requirements:",
        `Class: ${input.class}`,
        `Subject: ${input.subject}`,
        `Topic: ${input.topic}`,
        `Difficulty: ${input.difficulty}`,
        `Number of questions: ${input.numberOfQuestions}`,
        "",
        "Question type requirements:",
        "- Include multiple choice questions.",
        "- Include true/false questions.",
        "- Include fill in the blank questions.",
        "- Include short answer questions.",
        "- Distribute the question types as evenly as possible across the requested count.",
        "",
        "Quality requirements:",
        "- Multiple choice questions must have exactly four plausible choices.",
        "- True/false answers must be either True or False.",
        "- Fill in the blank prompts must contain a clear blank marker.",
        "- Short answer questions should be answerable in 1 to 3 sentences.",
        "- Include a complete answer key with brief explanations.",
      ].join("\n"),
    },
  ];
}
