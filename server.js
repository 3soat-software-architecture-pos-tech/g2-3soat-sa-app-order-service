import "dotenv/config";
import app from "./src/app.js";

const PORT = 80;

app.listen(PORT, () => {
  console.log(`servidor escutando em http://localhost:${PORT}`);
});
