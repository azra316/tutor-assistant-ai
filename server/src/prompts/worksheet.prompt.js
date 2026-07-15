export const worksheetJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "class",
    "subject",
    "topic",
    "difficulty",
    "numberOfQuestions",
    "learningObjective",
    "instructions",
    "questions",
    "answerKey",
  ],
  properties: {
    title: {
      type: "string",
      description: "Short printable worksheet title.",
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
      description: "The worksheet topic.",
    },
    difficulty: {
      type: "string",
      description: "The requested difficulty level.",
    },
    numberOfQuestions: {
      type: "integer",
      description: "Total number of questions generated.",
    },
    learningObjective: {
      type: "string",
      description: "A concise student-facing learning objective.",
    },
    instructions: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "string",
      },
    },
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["number", "type", "prompt", "points"],
        properties: {
          number: {
            type: "integer",
          },
          type: {
            type: "string",
            description: "Question type, such as short answer, application, or word problem.",
          },
          prompt: {
            type: "string",
            description: "Student-facing question text.",
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

export function buildWorksheetPrompt(input) {
  return [
    {
      role: "system",
      content: [
        "You are Tutor Assistant AI, an expert teacher and curriculum designer.",
        "Generate classroom-ready worksheets that are age-appropriate, clear, accurate, and printable.",
        "Use the requested class, subject, topic, difficulty, and question count exactly.",
        "Question prompts must be student-facing and should not mention that AI generated them.",
        "Avoid unsafe, biased, or inappropriate content. Keep language accessible for the class level.",
        "Return only data that matches the provided JSON schema.",
      ].join(" "),
    },
    {
      role: "user",
      content: [
        "Create a worksheet with these requirements:",
        `Class: ${input.class}`,
        `Subject: ${input.subject}`,
        `Topic: ${input.topic}`,
        `Difficulty: ${input.difficulty}`,
        `Number of questions: ${input.numberOfQuestions}`,
        "",
        "Worksheet quality requirements:",
        "- Include a clear learning objective.",
        "- Include 3 to 5 concise student instructions.",
        "- Generate exactly the requested number of questions.",
        "- Vary question types appropriately for the subject and difficulty.",
        "- Include a complete answer key with brief explanations.",
        "- Keep questions practical for a teacher to print or copy into a classroom handout.",
      ].join("\n"),
    },
  ];
}
