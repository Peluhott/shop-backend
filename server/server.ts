import app from './app'

// Use Render's provided port or default to 5000 for local development
const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`API on ${port}`);
});