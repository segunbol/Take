import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Rating from './Rating';

function Product(props) {
    const { product } = props;
    return (
        <Card className="product">
            <Link to={`/product/${product.slug}`}>
            <img src={product.image} className="card-img-top" alt={product.name} />
            </Link>
            <Card.Body>
                <Link to={`/product/${product.slug}`}>
                    <Card.Title>{product.name}</Card.Title>
                </Link>
                <Rating rating={product.rating} numReviews={product.numReviews} />
                <Button>Add To Cart</Button>
                <Card.Text>${product.price}</Card.Text> 
            </Card.Body>
              
        </Card>
    )
}

export default Product
