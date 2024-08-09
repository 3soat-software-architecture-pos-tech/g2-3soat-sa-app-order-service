import useCaseCreate from '../use_cases/order/add.js'
import useCasefindById from '../use_cases/order/findById.js';
import useCaseDelete from '../use_cases/order/deleteById.js'
import useCaseupdateById from '../use_cases/order/updateById.js';
import useCaseGetAllOrders from '../use_cases/order/getAll.js';
import useCaseStatusAll from '../use_cases/status/getAll.js';
import useCaseUpdateStatusById from '../use_cases/order/updateStatusById.js';
import useCaseProductById from '../use_cases/product/getById.js';
import sqsNotificationSend from '../api/services/sqsNotificationSend.js';
import { STATUS } from './statusController.js';

const getInProgressList = (order) => {
	const statusDoneList = order.filter(order => order.orderStatus?.description === 'done').sort((a, b) => a.createdAt - b.createdAt);
	const statusInProgressList = order.filter(order => order.orderStatus?.description === 'in_progress').sort((a, b) => a.createdAt - b.createdAt);
	const statusReceivedList = order.filter(order => order.orderStatus?.description === 'received').sort((a, b) => a.createdAt - b.createdAt);

	return [...statusDoneList, ...statusInProgressList, ...statusReceivedList]
}

export default function orderController() {

	const addNewOrder = async (req, res) => {
		const { orderNumber, customer, orderProductsDescription } = req.body;

		// vincular automaticamente o status
		const statusList = await useCaseStatusAll();
		const initialStatus = statusList?.find(status => status.statusName === STATUS.RECEIVED);
		// atualiza produtos a partir de orderProducts
		const orderProductsList = orderProductsDescription ? await Promise.all(orderProductsDescription?.map(async (product) => {
			// TODO: buscar detalhes do produto // await useCaseGetProductById(product.productId);
			let productDetails;
			try {
				productDetails = await useCaseProductById(product.productId);
			} catch (error) {
				return error.message;
			}
			const { productQuantity } = product;

			return {
				productId: product.productId,
				productPrice: productDetails?.price,
				productQuantity: productQuantity,
				productTotalPrice: productDetails?.price * productQuantity,
				title: productDetails?.productName,
				description: productDetails?.productName, //description do produto
				category: productDetails?.categoryDescription, //categoria do produto
				sku_number: productDetails?.id, //sku do produto
			}
		})) : [];

		if (orderProductsList.some(product => typeof product === 'string')) {
			return res.status(400).json(`Product not found ${orderProductsList.filter(product => typeof product === 'string')}`);
		}

		//calcular o total do pedido
		const totalOrderPrice = orderProductsList.reduce((total, product) => total + product.productTotalPrice, 0);

		// build data payment body
		const itemsList = orderProductsList.map(product => {
			return {
				title: `Produto ${product.productName} ${product.productId}`,
				unit_price: parseFloat(product.productPrice),
				quantity: product.productQuantity,
				total_amount: product.productTotalPrice,
				unit_measure: 'unit',
				sku_number: product.sku_number,
				category: product.category,
				description: product.description
			}
		});

		try {
			const order = await useCaseCreate(
				orderNumber,
				customer,
				totalOrderPrice,
				initialStatus.id,
				orderProductsDescription,
				Date(),
				Date()
			);

			const messageBody = {
				idorder: order.orderId.toString(),
				obs: 'reservar estoque',
				productIds: itemsList.map(product => {
					return {
						id: product.sku_number,
						quantity: product.quantity
					}
				})
			}

			try {
				sqsNotificationSend(process.env.AWS_QUEUE_URL_RESERVA_PRODUTOS, JSON.stringify(messageBody))
			} catch (error) {
				console.log(error)
			}
			return res.status(200).json({ order: order });
		} catch (error) {
			return res.status(400).json(`${error.message} - Order creation failed`);
		}
	};

	const fetchOrderById = async (req, res) => {
		const { id } = req.params;
		try {
			const result = await useCasefindById(id);

			if (!result) {
				return res.status(401).json(`No order found with id: ${id}`);
			}
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json(`${error.message} - Order fetchOrderById failed`);
		}
	};

	const fetchAllOrder = async (req, res) => {

		try {
			const result = await useCaseGetAllOrders();

			if (!result) {
				return res.status(401).json(`No orders found`);
			}
			if (req.query.list === 'in_progress') {
				const list = getInProgressList(result);
				return res.status(200).json(list);
			} else {
				return res.status(200).json(result);
			}

		} catch (error) {
			return res.status(400).json(`${error.message} - Order fetchAllOrder failed`);
		}
	};

	const deleteOrderById = async (req, res) => {
		const { id } = req.params;

		try {
			await useCaseDelete(id);
			return res.status(200).json('Order sucessfully deleted!');
		} catch (error) {
			return res.status(400).json(`${error.message} - Status deleteStatusById failed`);
		}
	};

	const updateOrderById = async (req, res) => {
		const { orderNumber, customer, orderProducts, totalOrderPrice, orderStatus } = req.body;
		const { id } = req.params;
 		try {
			const result = await useCaseupdateById(id,
				orderNumber,
				customer,
				orderProducts,
				totalOrderPrice,
				orderStatus,
				Date()
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json(`${error.message} - Status deleteStatusById failed`);
		}
	};

	const updateStatusById = async (req, res) => {
		const { orderStatus } = req.body;
		const { id } = req.params;
 		try {
			const result = await useCaseUpdateStatusById(id, orderStatus);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json(`${error.message} - Status deleteStatusById failed`);
		}
	};

	const updateOrderStatus = async (message) => {
		const { id, statusOrder } = message;
		const statusList = await useCaseStatusAll();
		const statusToUpdate = statusList?.find(status => status.statusName === statusOrder);

		if (!statusToUpdate) return 'Status not found';
 		try {
			const result = await useCaseUpdateStatusById(id, statusToUpdate.id);
			return result;
		} catch (error) {
			return error.message;
		}
	};

	const getOrder = async (id) => {
 		try {
			const result = await useCasefindById(id);
			return result;
		} catch (error) {
			return error.message;
		}
	};

	//TODO conferir o corpo da mensagem que vem da fila de PAGAMENTO concluido
	const sendToPay = async (message) => {
		const { id } = message;
		try {
			const orderData = await useCasefindById(id);
			console.log('result sendToPay ', orderData);
			const { orderNumber, orderProductsDescription, totalOrderPrice } = orderData;

			const orderProductsList = orderProductsDescription ? await Promise.all(orderProductsDescription.map(async (product) => {
				let productDetails;
				try {
					productDetails = await useCaseProductById(product.productId);
				} catch (error) {
					return error.message;
				}
				const { productQuantity } = product;

				return {
					productId: product.productId,
					productPrice: productDetails?.price,
					productQuantity: productQuantity,
					productTotalPrice: productDetails?.price * productQuantity,
					title: productDetails?.productName,
					description: productDetails?.productName, //description do produto
					category: productDetails?.categoryDescription, //categoria do produto
					sku_number: productDetails?.id, //sku do produto
				}
			})) : [];

			const itemsList = orderProductsList.map(product => {
				return {
					title: `Produto ${product.productName} ${product.productId}`,
					unit_price: parseFloat(product.productPrice),
					quantity: product.productQuantity,
					total_amount: product.productTotalPrice,
					unit_measure: 'unit',
					sku_number: product.sku_number,
					category: product.category,
					description: product.description
				}
			});
			const data = {
				description: `Purchase description ${orderNumber}`,
				order: orderNumber,
				items: itemsList,
				total_amount: totalOrderPrice
			};
			try {
				sqsNotificationSend(process.env.AWS_QUEUE_URL_SEND_PAYMENT, JSON.stringify(data))
			} catch (error) {
				console.log(error)
			}
		} catch (error) {
			return error.message;
		}
	}

	return {
		addNewOrder,
		fetchAllOrder,
		fetchOrderById,
		updateOrderById,
		deleteOrderById,
		updateStatusById,
		sendToPay,
		updateOrderStatus,
		getOrder
	};
}
