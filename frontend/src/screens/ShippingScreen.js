import React, {useState} from 'react';
import {Form, Button} from "react-bootstrap";
import {useDispatch,useSelector} from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import {saveShippingAddress} from "../actions/cartActions";


const ShippingScreen = ({ history }) => {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)
    const [email, setEmail] = useState(shippingAddress.email)

    const dispatch = useDispatch()
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({address,city,postalCode,country,email}))
        history.push('/payment')
    }
    return (
            <FormContainer>
                <CheckoutSteps step1 step2 />
                <h1>Pengiriman</h1>
                <Form onSubmit={submitHandler}>

                    <Form.Group controlId='address'>
                        <Form.Label>Alamat</Form.Label>
                        <Form.Control type={'text'} placeholder={'Alamat'} value={address} required onChange={(e) => setAddress(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='Kota'>
                        <Form.Label>Kota</Form.Label>
                        <Form.Control type={'text'} placeholder={'Kota'} value={city} required onChange={(e) => setCity(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='Postal Code'>
                        <Form.Label>Kode Pos</Form.Label>
                        <Form.Control type={'text'} placeholder={'Kode Pos'} value={postalCode} required onChange={(e) => setPostalCode(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='Country'>
                        <Form.Label>Negara</Form.Label>
                        <Form.Control type={'text'} placeholder={'Negara'} value={country} required onChange={(e) => setCountry(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type={'email'} placeholder={'email'} value={email} required onChange={(e) => setEmail(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Button type={"submit"} variant={"primary"}>
                        Lanjutkan
                    </Button>

                </Form>
            </FormContainer>
        )
}

export default ShippingScreen;