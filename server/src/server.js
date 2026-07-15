import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Tutor Assistant AI API running on port ${PORT}`);
});
