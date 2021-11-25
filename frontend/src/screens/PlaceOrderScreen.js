import React, {useEffect} from 'react';
import {Button, Row, Col, ListGroup, Image, Card} from "react-bootstrap";
import {useDispatch,useSelector} from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import {Link} from "react-router-dom";
import {createOrder} from "../actions/orderActions";

const PlaceOrderScreen = ({history}) => {
        const dispatch = useDispatch()
        const cart = useSelector(state => state.cart)

        const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
        }

        //menghirung harga
        cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))

        //menghitung pengiriman
        cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)

        //menghitung pajak
        cart.taxPrice = addDecimals(Number((0.005 * cart.itemsPrice).toFixed(2)))

        cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

        const orderCreate = useSelector((state) => state.orderCreate)
        const { order, success, error } = orderCreate

        useEffect(() => {
        if(success) {
            history.push(`/order/${order._id}`)
        }
        // eslint-disable-next-line
        }, [history, success])

        const placeOrderHandler= () => {
            dispatch(createOrder({
                orderItems : cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }))
        }
        return (
            <>
             <CheckoutSteps step1 step2 step3 step4 />
             <Row>
                 <Col md={8}>
                     <ListGroup variant={"flush"}>
                         <ListGroup.Item>
                             <h2>Pengiriman</h2>
                             <p>
                                 <strong>Alamat : </strong>
                                 {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                             </p>
                             <p>
                                 <strong> Email Pengiriman Lisensi: </strong>
                                 {cart.shippingAddress.email}
                             </p>
                         </ListGroup.Item>
                         <ListGroup.Item>
                             <h2>Metode Pembayaran</h2>
                             <strong>Metode : </strong>
                             {cart.paymentMethod}
                         </ListGroup.Item>

                         <ListGroup.Item>
                             <h2>Pesanan </h2>
                             {cart.cartItems.length === 0 ? <Message> Keranjangmu Masih Kosong Nih</Message>
                             : (
                                 <ListGroup variant={"flush"}>
                                     {cart.cartItems.map((item, index) => (
                                         <ListGroup.Item key={index}>
                                             <Row>
                                                 <Col md={2}>
                                                     <Image src={item.image} alt={item.name} fluid rounded/>
                                                 </Col>

                                                 <Col>
                                                     <Link to={`/product/${item.product}`}>
                                                         {item.name}
                                                     </Link>
                                                 </Col>

                                                 <Col md={4}>
                                                     {item.qty} x ${item.price} = ${item.qty * item.price}
                                                 </Col>
                                             </Row>
                                         </ListGroup.Item>
                                     ))}
                                 </ListGroup>
                                 )}
                         </ListGroup.Item>
                     </ListGroup>
                 </Col>
                 <Col md={4}>
                     <Card>
                         <ListGroup variant={"flush"}>
                             <ListGroup.Item>
                                 <h2>Detail Order</h2>
                             </ListGroup.Item>
                             <ListGroup.Item>
                                 <Row>
                                     <Col>Harga Barang</Col>
                                     <Col>${cart.itemsPrice}</Col>
                                 </Row>
                             </ListGroup.Item>

                             <ListGroup.Item>
                                 <Row>
                                     <Col>Pengiriman</Col>
                                     <Col>${cart.shippingPrice}</Col>
                                 </Row>
                             </ListGroup.Item>

                             <ListGroup.Item>
                                 <Row>
                                     <Col>Biaya layanan</Col>
                                     <Col>${cart.taxPrice}</Col>
                                 </Row>
                             </ListGroup.Item>

                             <ListGroup.Item>
                                 <Row>
                                     <Col>Total</Col>
                                     <Col>${cart.totalPrice}</Col>
                                 </Row>
                             </ListGroup.Item>

                                <ListGroup.Item>
                                    {error && <Message variant='danger'>{error}</Message>}
                                </ListGroup.Item>
                             <ListGroup.Item>
                                 <Button type={"button"} className={'btn-block'} disabled={cart.cartItems === 0} onClick={placeOrderHandler}>
                                     Konfirmasi Order
                                 </Button>
                             </ListGroup.Item>
                         </ListGroup>
                     </Card>
                 </Col>
             </Row>
            </>
        )
}

export default PlaceOrderScreen;