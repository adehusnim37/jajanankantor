import React from 'react';
import { Link } from "react-router-dom";
import {Card} from "react-bootstrap";
import Rating from './Rating';


const Product = ({ product }) => {
        return (
            <Card className='my-3 p-3 rounded'>
                <Link to={`/product/${product._id}`}>
                    <Card.Img src={product.image} style={{ height: 177 }}/>
                </Link>

                <Card.Body>
                    <Link to={`/product/${product._id}`}>
                        <Card.Title as={"div"} style={{ height: 50 }}>
                            <strong>{product.name}</strong>
                        </Card.Title>
                    </Link>

                    <Card.Text as={'div'}>
                        <Rating
                            value={product.rating}
                            text={`${product.numReviews} reviews`}
                        />
                    </Card.Text>

                    <Card.Text as={'h3'}>Rp.{new Intl.NumberFormat('id-id').format(product.price)}</Card.Text>
                </Card.Body>
            </Card>
        )
}

export default Product;