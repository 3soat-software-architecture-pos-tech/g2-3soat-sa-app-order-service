import swaggerUI from 'swagger-ui-express';
// import swaggerFile from '../../swagger-output.json';
import orderRoutes from './orderRoutes.js';
import statusRoutes from './statusRoutes.js';
import fs from 'fs';

import bodyParser from "body-parser";

export default function routes(app, express){
	const swaggerFile = JSON.parse(fs.readFileSync('./swagger-output.json', 'utf8'));

	app.use(bodyParser.json());
	app.use('/status', statusRoutes(express));
	app.use('/order', orderRoutes(express));

	app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));
}
