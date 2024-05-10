import useCaseCreate from '../use_cases/order/add.js'
import useCasefindById from '../use_cases/order/findById.js';
import useCaseDelete from '../use_cases/order/deleteById.js'
import useCaseupdateById from '../use_cases/order/updateById.js';
import useCaseGetAllOrders from '../use_cases/order/getAll.js';
import useCaseStatusAll from '../use_cases/status/getAll.js';
import addPayment from '../use_cases/payment/addMercadoPago.js';
import useCaseUpdateStatusById from '../use_cases/order/updateStatusById.js';
import { webhookURL } from '../config/webhookConfig.js';

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
		const initialStatus = statusList.find(status => status.description === 'pending' || status.description === 'payment_required');

		// atualiza produtos a partir de orderProducts
		const orderProductsList = await Promise.all(orderProductsDescription.map(async (product) => {
			// TODO: buscar detalhes do produto
			const productDetails = {} // await useCaseGetProductById(product.productId);
			const { productQuantity } = product;

			return {
				productId: product.productId,
				productPrice: productDetails.price,
				productQuantity: productQuantity,
				productTotalPrice: productDetails.price * productQuantity,
				productName: productDetails.productName
			}
		}));

		//calcular o total do pedido
		const totalOrderPrice = orderProductsList.reduce((total, product) => total + product.productTotalPrice, 0);

		// build data payment body
		const itemsList = orderProductsList.map(product => {
			return {
				title: `Produto ${product.productName} ${product.productId}`,
				unit_price: parseFloat(product.productPrice),
				quantity: product.productQuantity,
				total_amount: product.productTotalPrice,
				unit_measure: 'unit'
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

			const data = {
				title: `Order ${orderNumber}-${customer}`,
				description: `Purchase description ${orderNumber}`,
				external_reference: order?.orderId?.toString(), // Número interno do Pedido dentro da sua loja
				items: itemsList,
				notification_url: webhookURL,
				total_amount: totalOrderPrice
			};

			const qrcode = await addPayment(data);
			return res.status(200).json({ order: order, qrcode: qrcode });
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

	return {
		addNewOrder,
		fetchAllOrder,
		fetchOrderById,
		updateOrderById,
		deleteOrderById,
		updateStatusById,
	};
}
