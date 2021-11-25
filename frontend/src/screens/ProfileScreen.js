import React, {useState,useEffect} from 'react';
import {Form, Button, Row, Col, Table} from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
import {useDispatch,useSelector} from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {getUserDetails,updateUserDetails} from "../actions/userActions";
import { listMyOrders } from "../actions/orderActions";
import {USER_UPDATE_PROFILE_RESET} from "../constants/userConstants";
import moment from 'moment'

const ProfileScreen = ({location,history}) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { loading,error,user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    const orderListMy = useSelector((state) => state.orderListMy)
    const { loading : loadingOrders ,error : errorOrders,orders } = orderListMy

    useEffect(() => {
        if(!userInfo){
            history.push('/login')
        }else {
            if(!user.name || !user || success){
                dispatch({type: USER_UPDATE_PROFILE_RESET})
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrders())
            }else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch,history,userInfo,user, success])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword){
            setMessage('Konfirmasi password tidak sama.')
        }else {
            dispatch(updateUserDetails({id : user._id,name,email,password}))
            //Dispatch update profile
        }
    }
    return (
       <Row>
           <Col md={3}>
               <h2>Detail User</h2>
               {message && <Message variant='danger'>{message}</Message>}
               {error && <Message variant='danger'>{error}</Message>}
               {success && <Message variant='success'>Profile Berhasil Diupdate</Message>}
               {loading && <Loader/>}
               <Form onSubmit={submitHandler}>

                   <Form.Group controlId={name}>
                       <Form.Label> Nama Lengkap</Form.Label>
                       <Form.Control type='name' placeholder='Masukkan E-Mail' value={name}
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
                       <Form.Control type='password' placeholder='Konfirm Password' value={confirmPassword}
                                     onChange={(e) => setConfirmPassword(e.target.value)}>
                       </Form.Control>
                   </Form.Group>

                   <Button type={"submit"} variant={"primary"}> Update </Button>
               </Form>
           </Col>
           <Col md={9}>
               <h2>Pesanan saya</h2>
               {loadingOrders ? <Loader/> : errorOrders ? <Message variant='danger'>{errorOrders}</Message> :(
                   <Table striped bordered hover responsive className='table-sm' >
                    <thead>
                    <tr>
                        <th>Invoice</th>
                        <th>Tanggal</th>
                        <th>Total Belanja</th>
                        <th>Terbayar</th>
                        <th>Terkirim</th>
                        <th>Detail Order</th>
                    </tr>
                    </thead>
                       <tbody>
                       {orders.map(order => (
                           <tr key={order._id}>
                               <td>{order._id}</td>
                               <td>{moment(order.createdAt).format("MMM Do YYYY")}</td>
                               <td>{order.totalPrice}</td>
                               <td>{order.isPaid ? moment(order.paidAt).format("MMM Do YYYY")
                                   : <i className='fas fa-times' style={{color: 'red'}}></i>
                               }</td>

                               <td>{order.isDelivered ? moment(order.deliveredAt).format("MMM Do YYYY")
                                   : <i className='fas fa-times' style={{color: 'red'}}></i>
                               }</td>

                               <td>
                                   <LinkContainer to={`/order/${order._id}`}>
                                       <Button className={'btn-sm'} variant={'light'}>Details</Button>
                                   </LinkContainer>
                               </td>
                           </tr>
                       ))}
                       </tbody>
                   </Table>
                   )}
           </Col>
       </Row>
    )
}

export default ProfileScreen;