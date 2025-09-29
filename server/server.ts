import app from './app'

const port = Number(process.env.PORT) || 4000;
const host = "0.0.0.0";
app.listen(port, host, () => {
  console.log(`API listening on ${host}:${port}`);
});
