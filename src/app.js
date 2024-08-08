import express from "express";
import routes from "./web/index.js";
import queueWorker from "./api/services/queueWorker.js";

const app = express();
app.use(express.json());

routes(app, express);

// SQS processo de recebimento de mensagens
queueWorker();

export default app;
