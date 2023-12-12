import express from 'express'
const router = express.Router()
import {
    addOrderItems,
    getMyOrders,
    getOrderById,
    getOrders,
    updateOrderToPaid, updateOrderToDelivered, orderCancelledUser,
    updateBankCode,
    vaWebhook,
    CreateQRIS,
    QRISWebhook
} from "../controllers/orderController.js";
import {protect, admins, users} from "../middleware/authMiddleware.js";

router.route('/').post(protect, addOrderItems).get(protect, admins, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById).delete(protect, users, orderCancelledUser)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/pay/qris').put(protect, CreateQRIS)
router.route('/:id/delivered').put(protect,admins, updateOrderToDelivered)
router.route('/:orderId/updateBankCode/:Bankid').put(protect,users, updateBankCode)
router.route('/webhook/va').post(vaWebhook)
router.route('/webhook/qris').post(QRISWebhook)


export default router