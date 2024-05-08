import swaggerUI from 'swagger-ui-express';
import swaggerFile from '../../swagger-output.json';
import orderRoutes from './orderRoutes.js';
import statusRoutes from './statusRoutes.js';

import bodyParser from "body-parser";

export default function routes(app, express){
  app.use(bodyParser.json());
  app.use('/status', statusRoutes(express));
  app.use('/order', orderRoutes(express));

  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));
}
