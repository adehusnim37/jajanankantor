import Product from "../models/productModel.js";
import asyncHandler from 'express-async-handler';
import Order from "../models/orderModel.js";
import {createTransactionVAEgate} from "../config/CreateVA.js";
import {createTransactionQris} from "../config/CreateQRIS.js";

//@description membuat order baru
//@route post /api/orders
//@access Private

const vaWebhook = asyncHandler(async (req, res) => {
    console.log(req.body);
    const id = req.body.identifier_id
    const order = await Order.findById(id)
    console.log('order id : ', id)
    if (order) {
        if (req.body.status === 'SETTLED' || req.body.status === 'PAID') {
            order.isPaid = true
            order.paidAt = Date.now()
            await order.save()
        }
        res.status(200).json({message: 'OK'});
    } else {
        res.status(404).json({message: 'Order not found'})
    }
})

const QRISWebhook = asyncHandler(async (req, res) => {
    console.log(req.body);
    const id = req.body.identifier_id
    const order = await Order.findById(id)
    console.log('order id : ', id)
    if (order) {
        if (req.body.status === 'SETTLED' || req.body.status === 'PAID') {
            order.isPaid = true
            order.paidAt = Date.now()
            await order.save()
        }
        res.status(200).json({message: 'OK'});
    } else {
        res.status(404).json({message: 'Order not found'})
    }
})
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems, shippingAddress,
        paymentMethod, itemsPrice,
        taxPrice, shippingPrice,
        totalPrice
    } = req.body

    // Extract userOrder from req.body separately
    const userOrder = req.body.userOrder || {};

    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('Tidak ada order yang dipilih')
        return
    } else {
        const order = new Order({
            userOrder: {
                name: req.user.name,
                email: req.user.email,
                telpon: req.user.telpon,
                price: totalPrice,
                alamat: shippingAddress.address,
                remark: orderItems[0].name,
                expired_time: userOrder.expired_time, // Add expired_time to userOrder
            },
            orderItems,
            user: req.user._id,
            telpon: req.user.telpon,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        })
        const createdOrder = await order.save()
        // const createdVa = await createTransactionVAEgate(userOrder)
        res.status(201).json(createdOrder)
    }
})


//@description update order with new payment method
//@route POST /api/orders/:id/pay/egate
//@access private
const updateBankCode = asyncHandler(async (req, res) => {
    console.log(req.params.Bankid, req.params.orderId)
    const order = await Order.findById(req.params.orderId)
    const Bankid = req.params.Bankid
    const Bank = req.params.Bank
    console.log('Bank', Bank)

    if (order) {
        if (!order.userOrder || order.userOrder.length === 0) {
            res.status(400)
            throw new Error('User order not found')
        }
        const userOrder = order.userOrder[0]
        userOrder.bank_code = Bankid
        const createdVa = await createTransactionVAEgate(userOrder, req.params.orderId)
        console.log(createdVa)
        const va = createdVa.data.virtual_account
        order.virtualAccount = va
        console.log(order.virtualAccount)
        await order.save()
        res.json(createdVa)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})


// //@description update order telah terbayar menggunakan egate
// //@route GET /api/orders/:id/pay/egate
// //@access Private
//
// const updateOrderToPaidEgate = asyncHandler(async (req, res) => {
//     const {userOrder} = req.body
//
//     const order = await Order.findById(userOrder._id)
//
//     if (order) {
//         const {paymentMethod} = userOrder
//
//     }
// }

const CreateQRIS = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        if (!order.userOrder || order.userOrder.length === 0) {
            res.status(400)
            throw new Error('User order not found')
        }
        const userOrder = order.userOrder[0]
        const createdQris = await createTransactionQris(userOrder, req.params.id)
        console.log('createdQris', createdQris)
        const qris = createdQris.data.qris_text
        order.qrisText = qris
        console.log(order.qrisText)
        await order.save()
    } else {
        res.status(404)
        throw new Error('Order not found')
    }

})


//@description update order telah terbayar
//@route GET /api/orders/:id
//@access Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (order) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order tidak ditemukan')
    }
})


//@description update order telah terbayar
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
            telpon: req.body.payer.telpon,
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
    const orders = await Order.find({}).populate('user', 'id name')
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
const orderCancelledUser = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isDelivered = false;
        order.isPaid = false;

        const cancelledOrder = await order.remove()

        res.json(cancelledOrder)
        res.json({message: 'Order telah dicancel dan diremove'})
    } else {
        res.status(404)
        throw new Error("Order kamu telah diproses dan dibayar, tidak bisa dicancel ya")
    }
})


export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    orderCancelledUser,
    updateBankCode,
    vaWebhook,
    CreateQRIS,
    QRISWebhook
}
