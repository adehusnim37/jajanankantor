import {useEffect, useState} from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {Container} from "react-bootstrap";

import {useDispatch, useSelector} from "react-redux";
import {CreateQRIS} from "../actions/orderActions";
import QRCode from "react-qr-code";


function Qris({ title, body, orderId}) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const dispatch = useDispatch();

    const handleSubmit = async () => {
        await dispatch(CreateQRIS(orderId));
        window.location.reload();
    };

    useEffect(() => {
    }, [order.qrisText, loading, error]);

    return (
        <>
            <Button variant="primary" onClick={() => { handleSubmit(); }} className='btn btn-block'>
                {'Pembayaran Melalui Qris'}
            </Button>

            <Modal show={show} onHide={handleClose} className={'mw-100'}>
                <Modal.Header closeButton>
                    <Modal.Title>{order.qrisText ? 'QRIS' : title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        {body}
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Qris;
