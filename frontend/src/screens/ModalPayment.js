import {useEffect} from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import {updateBankCode, vaWebhook} from '../actions/orderActions';
import {useDispatch, useSelector} from "react-redux";
import Message from "../components/Message";

function ModalPayment({ match, location, history}) {
    const orderId = match.params.orderId
    const Bankid = match.params.Bankid
    const bank = match.params.Bank
    console.log(Bankid)
    console.log(orderId)

    const dispatch = useDispatch();

    const orderDetails = useSelector((state) => state.orderDetails)
    const {order, loading, error} = orderDetails

    const userLogin = useSelector((state) => state.userLogin)
    const {userInfo} = userLogin

    const selectedBank = location.state?.selectedBank || null;
    const selectedBankLabel = location.state?.selectedBankLabel || null;

    useEffect(() => {
    }, [dispatch, order, orderId]);

    return (
        <>
            <h1>Order {order._id}</h1>
            <h2>Detail Pesanan</h2>
            <p>
                <strong>Nama: </strong> {order.user.name}
            </p>
            <p>
                <strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
            </p>
            <p>
                <strong>NoTelp: </strong> {userInfo.telpon}
            </p>
            <p>
                {selectedBankLabel} - {selectedBank}
            </p>
            <p>
                <strong>Harga:</strong>
                {order.totalPrice}
            </p>
            <p>
                <strong>Alamat:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
            </p>

            { order.virtualAccount ? (
              <Message variant='sucesss'>Virtual Account {order.virtualAccount}</Message>
             ) : (
                <Message variant='danger'>Belum ada Virtual Account</Message>
            )}

            {order.isPaid ? (
                <Message variant='success'>Terbayar pada {order.paidAt}</Message>
            ) : (
                <Message variant='danger'>Belum Terbayar</Message>
            )}
            <Button onClick={() => {
                dispatch(updateBankCode(orderId, Bankid), dispatch(vaWebhook));
                history.push({
                    pathname: `/order/${orderId}`,
                    state: { selectedBankLabel: selectedBankLabel }
                });
            }}>Submit Payment</Button>
        </>
    )
}

export default ModalPayment;