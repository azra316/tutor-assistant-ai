export const lessonPlanJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "topic",
    "class",
    "duration",
    "objectives",
    "activities",
    "teachingSteps",
    "assessment",
    "materials",
  ],
  properties: {
    title: {
      type: "string",
      description: "Short teacher-facing lesson plan title.",
    },
    topic: {
      type: "string",
      description: "The lesson topic.",
    },
    class: {
      type: "string",
      description: "The target class or grade level.",
    },
    duration: {
      type: "string",
      description: "Total lesson duration.",
    },
    objectives: {
      type: "array",
      minItems: 2,
      maxItems: 4,
      items: {
        type: "string",
      },
    },
    activities: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "duration", "description"],
        properties: {
          name: {
            type: "string",
          },
          duration: {
            type: "string",
          },
          description: {
            type: "string",
          },
        },
      },
    },
    teachingSteps: {
      type: "array",
      minItems: 4,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["step", "teacherAction", "studentAction"],
        properties: {
          step: {
            type: "integer",
          },
          teacherAction: {
            type: "string",
          },
          studentAction: {
            type: "string",
          },
        },
      },
    },
    assessment: {
      type: "object",
      additionalProperties: false,
      required: ["method", "criteria", "exitTicket"],
      properties: {
        method: {
          type: "string",
        },
        criteria: {
          type: "array",
          minItems: 2,
          maxItems: 4,
          items: {
            type: "string",
          },
        },
        exitTicket: {
          type: "string",
        },
      },
    },
    materials: {
      type: "array",
      minItems: 2,
      maxItems: 6,
      items: {
        type: "string",
      },
    },
  },
};

export function buildLessonPlanPrompt(input) {
  return [
    {
      role: "system",
      content: [
        "You are Tutor Assistant AI, an expert lesson planner and instructional coach.",
        "Generate practical, age-appropriate lesson plans teachers can use immediately.",
        "Use the requested topic, class, and duration exactly.",
        "Return only data that matches the provided JSON schema.",
        "Do not include markdown, commentary, or hidden reasoning.",
      ].join(" "),
    },
    {
      role: "user",
      content: [
        "Create a complete lesson plan with these requirements:",
        `Topic: ${input.topic}`,
        `Class: ${input.class}`,
        `Duration: ${input.duration}`,
        "",
        "Lesson plan quality requirements:",
        "- Include measurable learning objectives.",
        "- Include engaging classroom activities with realistic timing.",
        "- Include sequential teaching steps with teacher and student actions.",
        "- Include an assessment method, success criteria, and an exit ticket.",
        "- Include materials needed for the lesson.",
        "- Keep the full plan realistic for the requested duration.",
      ].join("\n"),
    },
  ];
}
