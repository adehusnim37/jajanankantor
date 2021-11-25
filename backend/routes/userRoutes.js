import express from 'express'
const router = express.Router()
import {
    authUser,
    getUserProfile,
    registerUser,
    updateUserProfile,
    getUsers,
    deleteUsers,
    getUserById,
    updateUser
} from '../controllers/userController.js'
import {protect, admins} from "../middleware/authMiddleware.js";

router.route('/').post(registerUser).get(protect, admins, getUsers)
router.post('/login', authUser)
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
router
    .route('/:id')
    .delete(protect, admins, deleteUsers)
    .get(protect, admins, getUserById)
    .put(protect, admins, updateUser)

export default router