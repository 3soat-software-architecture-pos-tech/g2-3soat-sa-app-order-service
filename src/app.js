import express from "express";
import routes from "./web/index.js";
import receiveMessages from "./api/services/fila/pagamento.js";

const app = express();
app.use(express.json());

routes(app, express);

// SQS processo de recebimento de mensagens
receiveMessages();

export default app;
