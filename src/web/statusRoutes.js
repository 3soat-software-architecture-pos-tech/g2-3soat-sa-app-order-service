import statusController from "../controllers/statusController.js";

export default function statusRoutes(express) {
	const router = express.Router();
	const controller = statusController();

	// GET ENDPOINT
	router.route('/').get(controller.fetchAllStatus,
		// #swagger.tags = ['Status Order']
		// #swagger.description = 'Endpoint to list all categories.'
	);
	router.route('/:id').get(controller.fetchStatusById,
		// #swagger.tags = ['Status Order']
		// #swagger.description = 'Endpoint to get status by ID.'
	);


	// POST ENDPOINT
	router.route('/').post(controller.addNewStatus,
		// #swagger.tags = ['Status Order']
		// #swagger.description = 'Endpoint to add status.'
		/* #swagger.parameters['newStatus'] = {
				in: 'body',
				description: 'Information status.',
				required: true,
				schema: { $ref: "#/definitions/AddOrderStatus" }
		} */
	);

	// PUT ENDPOINT
	router.route('/:id').put(controller.updateStatusById,
		// #swagger.tags = ['Status Order']
		// #swagger.description = 'Endpoint to update customer by ID.'
		/* #swagger.parameters['updateStatus'] = {
				in: 'body',
				description: 'Information do status.',
				required: true,
				schema: { $ref: "#/definitions/UpdateOrderStatus" }
		} */
	);

	// DELETE ENDPOINT
	router.route('/:id').delete(controller.deleteStatusById,
		// #swagger.tags = ['Status Order']
		// #swagger.description = 'Endpoint to delete status by ID.'
	);

	return router;
}

