import swaggerUI from 'swagger-ui-express';
// import swaggerFile from '../../swagger-output.json';
import orderRoutes from './orderRoutes.js';
import statusRoutes from './statusRoutes.js';
import fs from 'fs';

import bodyParser from "body-parser";
import helmet, { hidePoweredBy } from 'helmet';
import crypto from 'crypto';

export default function routes(app, express){
	const swaggerFile = JSON.parse(fs.readFileSync('./swagger-output.json', 'utf8'));

	app.use(bodyParser.json());
	app.use(hidePoweredBy());
	// Middleware para gerar nonce
	app.use((req, res, next) => {
		res.locals.nonce = crypto.randomBytes(16).toString('base64');
		next();
	});
	app.use(helmet({
		contentSecurityPolicy: {
			useDefaults: true, // Utiliza políticas padrão do Helmet
			directives: {
				defaultSrc: ["'none'"], // Setting default policy
				scriptSrc: ["'self'"], // Allow scripts from the same origin
				imgSrc: ["'self'", "https://example.com/"], // Allow images from same origin and example.com
				styleSrc: ["'self'", "https://example.com/"], // Allow styles from same origin and example.com
			},
		},
		// Outras configurações do helmet
		xssFilter: true,
		noSniff: true,
		hidePoweredBy: true,
		hsts: {
			maxAge: 31536000, // 1 ano
			includeSubDomains: true,
			preload: true,
		},
	}))

	app.use('/status', statusRoutes(express));
	app.use('/order', orderRoutes(express));

	app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));
}
