export const homeworkJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "class",
    "subject",
    "topic",
    "learningObjective",
    "estimatedCompletionTime",
    "homework",
    "teacherNotes",
  ],
  properties: {
    title: {
      type: "string",
      description: "Short printable homework title.",
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
      description: "The homework topic.",
    },
    learningObjective: {
      type: "string",
      description: "A concise student-facing learning objective.",
    },
    estimatedCompletionTime: {
      type: "string",
      description: "Estimated time for students to complete the homework.",
    },
    homework: {
      type: "array",
      minItems: 4,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["number", "task", "studentInstructions", "successCriteria"],
        properties: {
          number: {
            type: "integer",
          },
          task: {
            type: "string",
            description: "Short name for the homework task.",
          },
          studentInstructions: {
            type: "string",
            description: "Clear student-facing instructions.",
          },
          successCriteria: {
            type: "string",
            description: "What a complete or high-quality answer should include.",
          },
        },
      },
    },
    teacherNotes: {
      type: "array",
      minItems: 2,
      maxItems: 4,
      items: {
        type: "string",
      },
    },
  },
};

export function buildHomeworkPrompt(input) {
  return [
    {
      role: "system",
      content: [
        "You are Tutor Assistant AI, an expert teacher and instructional designer.",
        "Generate practical, age-appropriate homework that reinforces classroom learning.",
        "Use the requested class, subject, and topic exactly.",
        "Return only data that matches the provided JSON schema.",
        "Do not include markdown, commentary, or hidden reasoning.",
      ].join(" "),
    },
    {
      role: "user",
      content: [
        "Create homework for a teacher with these requirements:",
        `Class: ${input.class}`,
        `Subject: ${input.subject}`,
        `Topic: ${input.topic}`,
        "",
        "Homework quality requirements:",
        "- Include a clear learning objective.",
        "- Include an estimated completion time.",
        "- Include 4 to 8 student-facing homework tasks.",
        "- Keep the workload realistic for the class level.",
        "- Make the tasks varied: recall, practice, application, and reflection where appropriate.",
        "- Include concise teacher notes for assigning or reviewing the homework.",
      ].join("\n"),
    },
  ];
}
