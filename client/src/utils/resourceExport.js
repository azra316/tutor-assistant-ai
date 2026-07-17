export function stringifyResource(resource) {
  return JSON.stringify(resource.content ?? resource, null, 2);
}

export function formatResourceForDisplay(resource) {
  const content = resource?.content ?? resource ?? {};
  const lines = [
    resource?.title ?? content.title,
    formatType(resource?.type ?? content.type ?? "resource"),
    "",
    ...formatValue(content),
  ].filter((line, index, allLines) => line != null && (line !== "" || allLines[index - 1] !== ""));

  return lines.join("\n").trim();
}

export function printResource(resource) {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    throw new Error("Your browser blocked the print window. Please allow pop-ups and try again.");
  }

  const printableText = formatResourceForDisplay(resource);

  printWindow.opener = null;
  printWindow.document.write(`
    <html>
      <head>
        <title>${escapeHtml(resource.title)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 32px; color: #17313B; }
          h1 { margin-bottom: 8px; }
          pre { white-space: pre-wrap; line-height: 1.5; background: #F6F8F7; padding: 16px; border-radius: 8px; font-family: Arial, sans-serif; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(resource.title)}</h1>
        <p>${escapeHtml(formatType(resource.type))}</p>
        <pre>${escapeHtml(printableText)}</pre>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export function downloadResourcePdf(resource) {
  const lines = formatResourceForDisplay(resource).split("\n")
    .map(toPdfSafeText);
  const pdf = createSimplePdf(lines);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${slugify(resource.title)}.pdf`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function createSimplePdf(lines) {
  const escapedLines = lines.flatMap((line) => wrapLine(line, 88)).slice(0, 58);
  const content = [
    "BT",
    "/F1 11 Tf",
    "50 780 Td",
    "14 TL",
    ...escapedLines.map((line) => `(${escapePdfText(line)}) Tj T*`),
    "ET",
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

function wrapLine(line, maxLength) {
  if (line.length <= maxLength) return [line];
  const chunks = [];
  for (let index = 0; index < line.length; index += maxLength) {
    chunks.push(line.slice(index, index + maxLength));
  }
  return chunks;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

function escapePdfText(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function toPdfSafeText(value) {
  return String(value).replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "?");
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "resource";
}

function formatType(type) {
  const labels = {
    worksheet: "Worksheet",
    quiz: "Quiz",
    homework: "Homework",
    lessonPlan: "Lesson Plan",
    topicExplanation: "Topic Explanation",
  };

  return (labels[type] ?? String(type).replace(/([A-Z])/g, " $1")).replace(/^./, (char) => char.toUpperCase());
}

function formatValue(value, label = "") {
  if (value == null || value === "") return [];

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => {
      const heading = label ? `${label} ${index + 1}` : `${index + 1}.`;
      if (typeof item === "object" && item !== null) {
        return [heading, ...formatValue(item).map((line) => `  ${line}`), ""];
      }

      return [`${index + 1}. ${String(item)}`];
    });
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([key]) => !["id", "_id", "__v", "createdAt", "updatedAt", "userId", "generatedBy"].includes(key))
      .flatMap(([key, nestedValue]) => {
        const friendlyLabel = formatLabel(key);
        const nestedLines = formatValue(nestedValue, friendlyLabel);

        if (nestedLines.length === 0) return [];
        if (typeof nestedValue === "object" && nestedValue !== null) {
          return [friendlyLabel, ...nestedLines.map((line) => `  ${line}`), ""];
        }

        return [`${friendlyLabel}: ${nestedLines.join(" ")}`];
      });
  }

  return [String(value)];
}

function formatLabel(value) {
  const labels = {
    answerKey: "Answer Key",
    class: "Class",
    difficulty: "Difficulty",
    estimatedCompletionTime: "Estimated Completion Time",
    funFact: "Fun Fact",
    learningObjective: "Learning Objective",
    numberOfQuestions: "Number of Questions",
    realLifeExample: "Real-Life Example",
    revisionPoints: "Revision Points",
    simpleExplanation: "Simple Explanation",
    studentInstructions: "Student Instructions",
    successCriteria: "Success Criteria",
    teacherAction: "Teacher",
    teacherName: "Teacher",
    teacherNotes: "Teacher Notes",
    teachingSteps: "Teaching Steps",
  };

  return labels[value] ?? String(value)
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}
