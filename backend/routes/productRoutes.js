import express from 'express'
const router = express.Router()
import {getProducts,getProductbyId, deleteProduct, updateProduct, createProduct, createProductReview,createTopProducts} from '../controllers/productController.js'
import {protect, admins} from "../middleware/authMiddleware.js";

router.route('/').get(getProducts).post(protect,admins,createProduct)
router.route('/:id/reviews').post(protect,createProductReview)
router.get('/top-produk', createTopProducts)
router.route('/:id').get(getProductbyId).delete(protect, admins, deleteProduct).put(protect,admins,updateProduct)



export default router