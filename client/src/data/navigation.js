import {
  BookOpenCheck,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Library,
  NotebookPen,
  Sparkles,
} from "lucide-react";

export const pages = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    eyebrow: "Overview",
    title: "Teacher Dashboard",
    description:
      "Plan faster, differentiate instruction, and keep every classroom resource organized.",
  },
  {
    id: "resources",
    label: "My Resources",
    icon: Library,
    eyebrow: "Saved Library",
    title: "My Resources",
    description:
      "Manage saved worksheets, quizzes, homework, lesson plans, and topic explanations.",
  },
  {
    id: "worksheet",
    label: "Worksheet Generator",
    icon: NotebookPen,
    eyebrow: "Practice Builder",
    title: "Worksheet Generator",
    description:
      "Create printable practice sets with scaffolded questions and answer keys.",
  },
  {
    id: "quiz",
    label: "Quiz Generator",
    icon: ClipboardList,
    eyebrow: "Assessment",
    title: "Quiz Generator",
    description:
      "Draft quick checks, exit tickets, and standards-aligned formative assessments.",
  },
  {
    id: "homework",
    label: "Homework Generator",
    icon: BookOpenCheck,
    eyebrow: "Independent Practice",
    title: "Homework Generator",
    description:
      "Assign thoughtful after-class work with support notes and clear expectations.",
  },
  {
    id: "lesson",
    label: "Lesson Planner",
    icon: GraduationCap,
    eyebrow: "Instruction Design",
    title: "Lesson Planner",
    description:
      "Structure objectives, activities, checks for understanding, and differentiation.",
  },
  {
    id: "explainer",
    label: "Topic Explainer",
    icon: HelpCircle,
    eyebrow: "Student Support",
    title: "Topic Explainer",
    description:
      "Turn complex topics into simple explanations, examples, and analogies.",
  },
];

export const generatorPresets = {
  worksheet: {
    fields: ["Subject", "Grade level", "Topic", "Difficulty", "Question count"],
    suggestions: ["Mixed practice", "Word problems", "Answer key", "Challenge section"],
  },
  quiz: {
    fields: ["Subject", "Grade level", "Topic", "Question types", "Time limit"],
    suggestions: ["Multiple choice", "Short answer", "Rubric", "Standards check"],
  },
  homework: {
    fields: ["Subject", "Grade level", "Topic", "Estimated time", "Support level"],
    suggestions: ["Parent note", "Worked example", "Reflection prompt", "Answer guide"],
  },
  lesson: {
    fields: ["Subject", "Grade level", "Objective", "Duration", "Class profile"],
    suggestions: ["Warm-up", "Mini lesson", "Guided practice", "Exit ticket"],
  },
  explainer: {
    fields: ["Topic", "Grade level", "Student level", "Tone", "Examples needed"],
    suggestions: ["Analogy", "Step-by-step", "Vocabulary list", "Check questions"],
  },
};
