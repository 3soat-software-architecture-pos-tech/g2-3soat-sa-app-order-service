import useCaseCreate from '../use_cases/status/add.js'
import useCasegetAll from '../use_cases/status/getAll.js'
import useCaseFindById from '../use_cases/status/findById.js';
import useCaseDelete from '../use_cases/status/deleteById.js'
import useCaseUpdateById from '../use_cases/status/updateById.js';

export const STATUS = {
	RECEIVED: 'received', //produto foi recebido
	PROCESSING: 'processing', //produto enviado para separacao sujeito a disponibilidade em estoque
	PAYMENT_REQUIRED: 'payment_required', // produto reservado e enviado para fila de pagamento
	PENDING: 'pending', // produto pago, enviado para preparacao
	IN_PROGRESS: 'in_progress', // produto sendo preparado
	DONE: 'done', // produto preparado e enviado para entrega
};

export default function statusController() {

	const addNewStatus = async (req, res) => {
		const { description, statusName } = req.body;
		try {
			const status = await useCaseCreate(description, statusName, Date(), Date());
			return res.status(200).json(status);
		} catch (error) {
			return res.status(400).json(`${error.message} - Status creation failed`);
		}
	};

	const fetchStatusById = async (req, res) => {
		try {
			const status = await useCaseFindById(req.params.id);
			if (!status) {
				return res.status(401).json(`No status found with id: ${req.params.id}`);
			}
			return res.status(200).json(status);
		} catch (error) {
			return res.status(400).json(`${error.message} - Status fetchStatusById failed`);
		}
	};

	const fetchAllStatus = async (req, res) => {
		try {
			const statusList = await useCasegetAll();
			return res.status(200).json(statusList);
		} catch (error) {
			return res.status(400).json(`${error.message} - Status fetchAllStatus failed`);
		}
	};

	const deleteStatusById = async (req, res) => {
		const { id } = req.params;

		try {
			const statusList = await useCaseDelete(id);
			return res.status(200).json(statusList);
		} catch (error) {
			return res.status(400).json(`${error.message} - Status deleteStatusById failed`);
		}
	};

	const updateStatusById = async (req, res) => {
		const { description, statusName } = req.body;
		const { id } = req.params;
 		try {
			const result = await useCaseUpdateById(id, statusName, description, Date());
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json(`${error.message} - Status deleteStatusById failed`);
		}
	};

	return {
		addNewStatus,
		fetchAllStatus,
		fetchStatusById,
		updateStatusById,
		deleteStatusById
	};
}