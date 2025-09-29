import app from './app'

// Use Render's provided port or default to 5000 for local development
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API on ${port}`);
});