import React, {useState,useEffect} from 'react';
import { Link} from "react-router-dom";
import {Form, Button, Row, Col } from "react-bootstrap";
import {useDispatch,useSelector} from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import {register} from "../actions/userActions";

const RegisterScreen = ({location,history}) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const userRegister = useSelector(state => state.userRegister)
    const { loading,error,userInfo } = userRegister

    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(() => {
        if(userInfo){
            history.push(redirect)
        }
    }, [history,userInfo,redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword){
            setMessage('Konfirmasi password tidak sama.')
        }else {
            dispatch(register(name, email, password))
        }
        //DISPATCH register
    }
    return (
        <FormContainer>
            <h1>Sign Up !</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader/>}
            <Form onSubmit={submitHandler}>

                <Form.Group controlId={name}>
                    <Form.Label> Nama Lengkap</Form.Label>
                    <Form.Control type='name' placeholder='Masukkan Nama' value={name}
                                  onChange={(e) => setName(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId={email}>
                    <Form.Label> Alamat E-Mail</Form.Label>
                    <Form.Control type='email' placeholder='Masukkan E-Mail' value={email}
                                  onChange={(e) => setEmail(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId={password}>
                    <Form.Label> Password </Form.Label>
                    <Form.Control type='password' placeholder='Masukkan Password' value={password}
                                  onChange={(e) => setPassword(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId={confirmPassword}>
                    <Form.Label> Konfirmasi Password </Form.Label>
                    <Form.Control type='password' placeholder='Konfirmasi Password' value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Button type={"submit"} variant={"primary"}> Daftar </Button>
            </Form>

            <Row className='py-3'>
                <Col> Punya akun ? {''} <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}> Login yuk !</Link> </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen;