import Product from "../models/productModel.js";
import asyncHandler from 'express-async-handler';
import Order from "../models/orderModel.js";

//@description membuat order baru
//@route post /api/orders
//@access Private
const addOrderItems = asyncHandler(async (req,res) => {
    const { orderItems,shippingAddress,
        paymentMethod, itemsPrice,
        taxPrice, shippingPrice,
        totalPrice
    } = req.body

    if(orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('Tidak ada order yang dipilih')
        return
    }else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        })

        const createdOrder = await order.save()

        res.status(201).json(createdOrder)
    }
})


//@description update order telah terbayar
//@route GET /api/orders/:id
//@access Private
const getOrderById = asyncHandler(async (req,res) => {
    const order = await  Order.findById(req.params.id).populate('user', 'name email')

    if(order){
        res.json(order)
    }else {
        res.status(404)
        throw new Error('Order tidak ditemukan')
    }
})


//@description udatea
//@route GET /api/orders/:id/pay
//@access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        }

        const updatedOrder = await order.save()

        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

//@description Get User Detail Order
//@route GET /api/orders/myorder
//@access Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({user: req.user._id})
    res.json(orders)
})

//@description Get semua order user
//@route GET /api/orders
//@access Private
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user','id name')
    res.json(orders)
})

//@description update order menjadi terkirim
//@route Put /api/orders/:id/delivered
//@access Private/admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save()

        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order tidak ditemukan')
    }
})

//desc order menjadi dibatalkan
//@route put delete /api/orders/:id
//@access to user only
const orderCancelledUser = asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id)

    if(order) {
        order.isDelivered = false;
        order.isPaid = false;

        const cancelledOrder = await order.remove()

        res.json(cancelledOrder)
        res.json({ message: 'Order telah dicancel dan diremove' })
    }else {
        res.status(404)
        throw new Error("Order kamu telah diproses dan dibayar, tidak bisa dicancel ya")
    }
})

export {addOrderItems, getOrderById, updateOrderToPaid,getMyOrders, getOrders, updateOrderToDelivered, orderCancelledUser}
