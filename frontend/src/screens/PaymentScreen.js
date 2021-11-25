import React, {useState} from 'react';
import {Form, Button, Col} from "react-bootstrap";
import {useDispatch,useSelector} from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";


const PaymentScreen = ({ history }) => {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    if(!shippingAddress){
        history.push('/shipping')
    }

    const [paymentMethod, setPaymentMethod] = useState("")

    const dispatch = useDispatch()
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
    }
    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 step4/>
            <h1>Metode Pembayaran</h1>
            <Form onSubmit={submitHandler}>

                <Form.Group>
                    <Form.Label as='legend'>Pilih Pembayaran</Form.Label>
                <Col>
                    <Form.Check type='radio' label="Bank Transfer" id='bank' name='paymentMethod' value='Bank Transfer'
                                onChange={(e) => setPaymentMethod(e.target.value)}>

                    </Form.Check>

                    <Form.Check type='radio' label="Paypal atau Credit Card" id='paypal' name='paymentMethod' value='Paypal Dan Kredit Card'
                                onChange={(e) => setPaymentMethod(e.target.value)}>

                    </Form.Check>

                    <Form.Check type='radio' label="E-Payment" id='epay' name='paymentMethod' value='Elektronik Payment (OVO,GOPAY,DANA)'
                                onChange={(e) => setPaymentMethod(e.target.value)}>

                    </Form.Check>
                </Col>
                </Form.Group>

                <Button type="submit" variant="primary">
                    Lanjutkan
                </Button>

            </Form>
        </FormContainer>
    )
}

export default PaymentScreen;