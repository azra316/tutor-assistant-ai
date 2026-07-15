import {
  BookOpenCheck,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  NotebookPen,
  Sparkles,
} from "lucide-react";

export const pages = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    eyebrow: "Overview",
    title: "Good afternoon, Ms. Rivera",
    description:
      "Plan faster, differentiate instruction, and keep every classroom resource organized.",
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

export const quickActions = [
  "Create Grade 6 fractions worksheet",
  "Draft biology exit ticket",
  "Plan a 45-minute grammar lesson",
  "Explain photosynthesis simply",
];

export const recentGenerations = [
  {
    title: "Linear Equations Practice",
    type: "Worksheet",
    className: "Algebra 1",
    time: "12 min ago",
  },
  {
    title: "Main Idea Exit Ticket",
    type: "Quiz",
    className: "Grade 5 ELA",
    time: "38 min ago",
  },
  {
    title: "Civil War Lesson Arc",
    type: "Lesson Plan",
    className: "Grade 8 History",
    time: "Yesterday",
  },
];

export const dashboardStats = [
  { label: "Resources created", value: "128", change: "+18 this week" },
  { label: "Hours saved", value: "42", change: "Estimated planning time" },
  { label: "Active classes", value: "7", change: "Across 4 subjects" },
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
