import {useEffect, useState} from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Radio from "./Radio";
import {Container} from "react-bootstrap";

import {useDispatch, useSelector} from "react-redux";
import {CreateQRIS} from "../actions/orderActions";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";


function Qris({match, title, body, orderId}) {

    const [show, setShow] = useState(false);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const orderDetails = useSelector((state) => state.orderDetails)
    const {order, loading, error} = orderDetails

    const statusQris = false

    const dispatch = useDispatch();

    // Function to handle submit
    const handleSubmit = () => {
        dispatch(CreateQRIS(orderId))
    };

    useEffect(() => {

    }, [dispatch, order.qrisText])

    return (
        <>
            <Button variant="primary" onClick={handleShow} className='btn btn-block'>
                {order.qrisText ? 'Show Qris' : 'Pembayaran Melalui Qris'}
            </Button>

            <Modal show={show} onHide={handleClose} className={'mw-100'}>
                <Modal.Header closeButton>
                    <Modal.Title>{order.qrisText ? 'QRIS' : title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        {body}
                        {order.qrisText ? (
                            <QRCode value={order.qrisText} />
                        ) : (
                            <p>QRIS not created yet.</p>
                        )}
                    </Container>
                </Modal.Body>

                <Container>
                    <Button
                        className={'mb-3'} variant="primary"
                        onClick={() => {
                            handleSubmit();
                            handleClose();
                        }}>
                        {order.qrisText ? 'Sudah Membayar' : 'Submit'}
                    </Button>
                </Container>

            </Modal>
        </>
    );
}


export default Qris;