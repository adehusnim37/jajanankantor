import React, {useEffect} from 'react';
import {LinkContainer} from 'react-router-bootstrap'
import {Table, Button, Row, Col} from "react-bootstrap";
import {useDispatch,useSelector} from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {listProduct, deleteProduct, createProduct} from "../actions/productActions";
import {PRODUCT_CREATE_RESET} from "../constants/productConstant";
import Paginate from "../components/Paginate";

const ProductListScreen = ({history, match}) => {
    const pageNumber = match.params.pageNumber || 1
    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages} = productList

    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, error: errorDelete, success:successDelete} = productDelete

    const productCreate = useSelector(state => state.productCreate)
    const { loading: loadingCreate, error: errorCreate, success:successCreate, product: createdProduct} = productCreate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(()=> {
        dispatch({type: PRODUCT_CREATE_RESET})

        if(!userInfo.isAdmin){
            history.push('/login')
        }
        if(successCreate){
            history.push(`/admin/products/${createdProduct._id}/edit`)
        }else {
            dispatch(listProduct('', pageNumber))
        }
    }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct, pageNumber])

    const deleteHandler = (id) => {
        if(window.confirm('Kamu yakin?')) {
            dispatch(deleteProduct(id))
        }
    }

    const creteProductHandler = () => {
        dispatch(createProduct())
    }

    return(
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>Produk</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={creteProductHandler}>
                        <i className='fas fa-plus'></i> Buat Produk
                    </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader/>}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message> }
            {loadingCreate && <Loader/>}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message> }
            {loading ? <Loader/> : error ? <Message variant={'danger'}>{error}</Message>
                :(
                    <>
                    <Table striped bordered hover responsive className={'table-sm'}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama</th>
                            <th>Harga</th>
                            <th>Categoty</th>
                            <th>Brand</th>
                        </tr>
                        </thead>

                        <tbody>
                        {products && products.map((products) => (
                            <tr key={products._id}>
                                <td>{products._id}</td>
                                <td>{products.name}</td>
                                <td>Rp.{products.price}</td>
                                <td>{products.category}</td>
                                <td>{products.brand}</td>
                                <td>
                                    <LinkContainer to={`/admin/products/${products._id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(products._id)}>
                                        <i className={'fas fa-trash'}>

                                        </i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                        <Paginate pages={pages} page={page} isAdmin={true}/>
                    </>
                )}
        </>
    )

};

export default ProductListScreen;