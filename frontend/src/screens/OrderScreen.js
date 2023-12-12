import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {PayPalButton} from 'react-paypal-button-v2'
import {Link} from 'react-router-dom'
import {Row, Col, ListGroup, Image, Card, Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {getOrderDetails, payOrder, deliveredOrder} from '../actions/orderActions'
import {ORDER_PAY_RESET, ORDER_DELIVERED_RESET, ORDER_DELETE_SUCCESS} from '../constants/orderConstants'
import {cancelledOrder} from "../actions/orderActions";
import Egate from "../components/Egate";
import {value} from "mongoose/lib/options/propertyOptions";
import moment from "moment";
import Qris from "../components/Qris";

const OrderScreen = ({match, history, location}) => {
    const orderId = match.params.id

    const [sdkReady, setSdkReady] = useState(false)

    const dispatch = useDispatch()

    const orderDetails = useSelector((state) => state.orderDetails)
    const {order, loading, error} = orderDetails

    const orderPay = useSelector((state) => state.orderPay)
    const {loading: loadingPay, success: successPay} = orderPay

    const orderDelivered = useSelector((state) => state.orderDelivered)
    const {loading: loadingDelivered, success: successDelivered} = orderDelivered

    const userLogin = useSelector((state) => state.userLogin)
    const {userInfo} = userLogin

    const [midTransToken, setMidTransToken] = useState(null)
    const [isMidTransSDKReady, setMidTransSDKReady] = useState(false)


    const selectedBank = location.state?.selectedBank || null;

    const deleteHandler = (id) => {
        if (window.confirm('Kamu yakin cancel pesanan?')) {
            dispatch(cancelledOrder(id))
            window.alert('pesanan kamu telah dihapus dan dicancel.');
            history.push('/')
        }
    }


    if (!loading) {
        //   Calculate prices
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }

        order.itemsPrice = addDecimals(
            order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
        )
    }

    useEffect(() => {
        addMidTransScript()
    }, [])
    const addMidTransScript = async () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `https://app.midtrans.com/snap/snap.js`
        script.setAttribute('data-client-key', 'SB-Mid-client-kcN2h53eawqXNH4c')
        script.async = true
        script.onload = () => {
            setMidTransSDKReady(true)
        }
        document.head.appendChild(script)
    }

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        }

        const addPayPalScript = async () => {
            const {data: clientId} = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () =>
                setSdkReady(true)
            document.head.appendChild(script)
        }


        if (userInfo?.token) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
            const addMidtrans = async () => {
                const {data: {transactionToken}} = await axios.get(`/api/config/midtrans/${orderId}`, config)
                setMidTransToken(transactionToken)
            }
            addMidtrans()
        }


        if (!order || successPay || successDelivered || order._id !== orderId) {
            dispatch({type: ORDER_PAY_RESET});
            dispatch({type: ORDER_DELIVERED_RESET})
            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }

        }
    }, [dispatch, orderId, successPay, successDelivered, history, userInfo])

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult)
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliveredHandler = () => {
        dispatch(deliveredOrder(order))
    }


    return loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> :
        <>{console.log(JSON.stringify(order))}
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant={"flush"}>
                        <ListGroup.Item>
                            <h2>Pengiriman</h2>
                            <p>
                                <strong>Nama : </strong> {order.user.name}
                            </p>
                            <p>
                                <a href={`mailto:${order.user.email}`}>Email : {order.user.email}</a>
                            </p>
                            <p>
                                <strong>Alamat : </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            <p>
                                <strong> Nomor Telepon : </strong>
                                {userInfo.telpon}
                            </p>
                            <p>
                                <strong> Email Pengiriman Lisensi: </strong>
                                {order.shippingAddress.email}
                            </p>
                            {order.isDelivered ?
                                <Message variant='success'>
                                    Produk telah dikirimkan dengan nomor resi {order._id} ke
                                    email {order.shippingAddress.email} pada {moment(order.deliveredAt).format('YYYY MM DD HH:mm:ss')}.
                                </Message> :
                                <Message variant='danger'>Belum Terkirim</Message>}

                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Metode Pembayaran</h2>
                            <p>
                                <strong>Metode : </strong>
                                {order.paymentMethod}
                            </p>
                            {!order.isPaid && order.virtualAccount &&
                                <Message variant='success'>Virtual
                                    Account {order.virtualAccount} - {location.state?.selectedBankLabel}</Message>
                            }
                            {order.isPaid ? (
                                <Message variant='success'>Terbayar
                                    pada {moment(order.paidAt).format('YYYY MM DD HH:mm:ss')}</Message>
                            ) : (
                                <Message variant='danger'>Belum Terbayar / Menunggu Pembayaran</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Pesanan </h2>
                            {order.orderItems.length === 0 ?
                                <Message> Order Kosong Nih</Message>
                                : (
                                    <ListGroup variant={"flush"}>
                                        {order.orderItems.map((item, index) => (
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
                                                        {item.qty} x Rp{item.price} = Rp{item.qty * item.price}
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
                                    <Col>Rp.{order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Pengiriman</Col>
                                    <Col>Rp.{order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Biaya layanan</Col>
                                    <Col>Rp.{order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>Rp.{order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>


                            {!order.isPaid && (
                                <ListGroup.Item>
                                    <Button style={{backgroundColor: "black", width: "100%"}}
                                            onClick={() => deleteHandler(order._id)}>
                                        Cancelled Order
                                    </Button>
                                </ListGroup.Item>
                            )}

                            {!order.isPaid && !order.virtualAccount && order.paymentMethod === 'Bank Transfer' && (
                                <ListGroup.Item>
                                    <Egate orderId={order._id} Bankid={selectedBank}
                                           title={`Pembayaran menggunakan Virtual Account`}
                                           body={`Pembayaran untuk order ${order._id}`}/>
                                </ListGroup.Item>
                            )}

                            {!order.isPaid && order.paymentMethod === 'QRIS' && (
                                <ListGroup.Item>
                                    <Qris orderId={order._id} title={`Pembayaran menggunakan Qris`}
                                          body={`Pembayaran untuk order ${order._id}`}/>
                                </ListGroup.Item>
                            )
                            }


                            {/*<div>*/}
                            {/*    {*/}
                            {/*        !order.isPaid&&*/}
                            {/*        (*/}
                            {/*            midTransToken && isMidTransSDKReady ?*/}
                            {/*                (*/}
                            {/*                    <ListGroup.Item>*/}
                            {/*                        <Button style={{backgroundColor:"lightblue", width:"100%"}} variant="light" id="pay-button" onClick={()=> window.snap.pay(midTransToken)}>*/}
                            {/*                            <img style={{width:"130px", height:'auto'}} src="https://docs.midtrans.com/asset/image/main/midtrans-logo.png" alt="midtrans"/>*/}
                            {/*                        </Button>*/}
                            {/*                    </ListGroup.Item>*/}
                            {/*                ):<Loader/>*/}

                            {/*        )*/}
                            {/*    }*/}
                            {/*</div>*/}

                            {/*{!order.isPaid &&*/}
                            {/*(<ListGroup.Item>*/}
                            {/*    {loadingPay && <Loader/>}*/}
                            {/*    {!sdkReady ? (<Loader/>) :*/}
                            {/*        (<PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler}/>)*/}
                            {/*    }*/}
                            {/*</ListGroup.Item>)*/}
                            {/*}*/}


                            {loadingDelivered && <Loader/>}
                            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button type='Button' className='btn btn-block' onClick={deliveredHandler}>
                                        Sudah Terkirim
                                    </Button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
}

export default OrderScreen;
