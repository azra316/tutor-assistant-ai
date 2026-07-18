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
          @page { margin: 0.7in; }
          body { font-family: Arial, sans-serif; margin: 0; color: #17313B; font-size: 13px; line-height: 1.55; }
          h1 { margin: 0 0 6px; font-size: 24px; line-height: 1.2; }
          .eyebrow { margin: 0 0 22px; color: #1E7F67; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
          pre { white-space: pre-wrap; line-height: 1.6; font-family: Arial, sans-serif; font-size: 13px; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(resource.title)}</h1>
        <p class="eyebrow">${escapeHtml(formatType(resource.type))}</p>
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
  const printableLines = preparePdfLines(lines);
  const pages = paginate(printableLines, 44);
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  ];

  pages.forEach((pageLines, pageIndex) => {
    const pageObjectNumber = 5 + pageIndex * 2;
    const contentObjectNumber = pageObjectNumber + 1;
    const content = buildPageContent(pageLines, pageIndex);
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`,
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    );
  });

  const pageKids = pages.map((_, pageIndex) => `${5 + pageIndex * 2} 0 R`).join(" ");
  objects[1] = `<< /Type /Pages /Kids [${pageKids}] /Count ${pages.length} >>`;

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

function preparePdfLines(lines) {
  return lines.flatMap((line, index) => {
    const maxLength = index < 2 ? 74 : 86;
    return wrapLine(line, maxLength);
  });
}

function paginate(lines, pageLength) {
  const pages = [];
  for (let index = 0; index < lines.length; index += pageLength) {
    pages.push(lines.slice(index, index + pageLength));
  }
  return pages.length > 0 ? pages : [[""]];
}

function buildPageContent(lines, pageIndex) {
  const commands = ["BT"];

  if (pageIndex === 0) {
    commands.push("/F2 18 Tf", "50 760 Td", "24 TL");
  } else {
    commands.push("/F2 12 Tf", "50 760 Td", "18 TL", `(${escapePdfText("Tutor Assistant Resource")}) Tj T*`, "/F1 11 Tf");
  }

  lines.forEach((line, lineIndex) => {
    if (pageIndex === 0 && lineIndex === 1) {
      commands.push("/F1 10 Tf", "14 TL");
    } else if (pageIndex === 0 && lineIndex === 2) {
      commands.push("/F1 11 Tf", "16 TL");
    }

    commands.push(`(${escapePdfText(line)}) Tj T*`);
  });

  commands.push("ET");
  return commands.join("\n");
}

function wrapLine(line, maxLength) {
  if (line.length <= maxLength) return [line];
  const chunks = [];
  const words = String(line).split(" ");
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      chunks.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) chunks.push(current);

  if (chunks.length === 0) {
    for (let index = 0; index < line.length; index += maxLength) {
      chunks.push(line.slice(index, index + maxLength));
    }
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
