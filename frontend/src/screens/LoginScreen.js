import React, {useState,useEffect} from 'react';
import { Link} from "react-router-dom";
import {Form, Button, Row, Col} from "react-bootstrap";
import {useDispatch,useSelector} from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import {login,getGoogleUserInfo} from "../actions/userActions";

const LoginScreen = ({location,history}) => {
    const [email, setEmail] = useState('')
    const [password,setPassword] = useState('')

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { loading,error,userInfo } = userLogin

    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(() => {
        if(userInfo){
            history.push(redirect)
        }
    }, [userInfo,history,redirect])

    useEffect(() => {
        if (!userInfo) {
            dispatch(getGoogleUserInfo());
        }
        // eslint-disable-next-line
    }, []);

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email,password))
        //DISPATCH LOGIN
    }

    const signInWithGoogleHandler = (e) => {
        e.preventDefault();
        window.location.href = `/api/auth/google?redirect=${redirect}`;
    };
        return (
           <FormContainer>
               <h1>sign in</h1>
               {error && <Message variant='danger'>{error}</Message>}
               {loading && <Loader/>}
               <Form onSubmit={submitHandler}>
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

                   <Button
                       type='submit'
                       variant='primary'
                       style={{ marginRight: '5px' }}
                   >
                       Sign In
                   </Button>
                   <p> Or </p>
                   <Button
                       type='button'
                       variant='danger'
                       onClick={signInWithGoogleHandler}
                   >
                       <i className='fab fa-google left'> Sign In With Google</i>
                   </Button>

               </Form>

               <Row className='py-3'>
                   <Col> Pelanggan baru? {''} <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}> Daftar</Link> </Col>
               </Row>
           </FormContainer>
        )
}

export default LoginScreen;