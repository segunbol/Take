import Rating from "../components/Rating";
import axios from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError, baseURL } from "../utils";
import { Store } from "../Store";
import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, LOADING: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [selectedImage, setSelectedImage] = useState("");
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: "",
  });
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  console.log(reviews)

  // const getReviews = async (e) => {
    
  //   try {
  //     const productReviews = await axios.get(
  //       `${baseURL}reviews/product/${product._id}`
  //     );
  //     setReviews(productReviews.data);
  //   } catch (err) {
  //     dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  //   }
  // };

  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     try {
  //       await getReviews();
  //     } catch (err) {
  //       dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  //     }
  //   };
  
  //   fetchReviews();
  // }, [product._id]);

  const getReviews = async (productId) => {
      try {
        const productReviews = await axios.get(
          `${baseURL}reviews/product/${productId}`
        );
        return productReviews.data;
      } catch (err) {
        throw getError(err);
      }
    };
    
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const reviews = await getReviews(product._id);
          setReviews(reviews);
        } catch (err) {
          dispatch({ type: "FETCH_FAIL", payload: err });
        }
      };
    
      fetchReviews();
    }, [product._id])


  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`${baseURL}products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  // const getReviews = async (e) => {
    
  //   try {
  //     const productReviews = await axios.get(
  //       `${baseURL}reviews/product/${product._id}`
  //     );
  //     setReviews(productReviews.data);
  //   } catch (err) {
  //     dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  //   }
  // };

  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     try {
  //       await getReviews();
  //     } catch (err) {
  //       dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  //     }
  //   };
  
  //   fetchReviews();
  // }, [product._id]);

  // const getReviews = async (productId) => {
  //   try {
  //     const productReviews = await axios.get(
  //       `${baseURL}reviews/product/${productId}`
  //     );
  //     return productReviews.data;
  //   } catch (err) {
  //     throw getError(err);
  //   }
  // };
  
  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     try {
  //       const reviews = await getReviews(product._id);
  //       setReviews(reviews);
  //     } catch (err) {
  //       dispatch({ type: "FETCH_FAIL", payload: err });
  //     }
  //   };
  
  //   fetchReviews();
  // }, [product._id])

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  console.log(reviews);
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`${baseURL}products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry, Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if(!userInfo){
      navigate("/signin")
      return
    }
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const res = await axios.post(
        `${baseURL}reviews/create`,
        {
          author: userInfo.name,
          review: newReview,
          productId: product._id,
          userId: userInfo._id,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "CREATE_SUCCESS",
      });
      toast.success("Review Posted Successfully");
      setNewReview("")
      setReviews([...reviews, res.data]);
      // navigate("/admin/products");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <div>
        <Row>
          <Col md={6}>
            <img
              className="img-large rounded"
              src={selectedImage || product.image}
              alt={product.name}
            />
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Helmet>
                  <title>{product.name}</title>
                </Helmet>
                <h1>{product.name}</h1>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  rating={product.rating}
                  numReviews={product.numReviews}
                ></Rating>
              </ListGroup.Item>
              <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
              <ListGroup.Item>
                <Row xs={1} md={2} className="g-2">
                  {[product.image, ...product.images].map((x) => (
                    <Col key={x}>
                      <Card>
                        <Button
                          className="thumbnail"
                          type="button"
                          variant="light"
                          onClick={() => setSelectedImage(x)}
                        >
                          <Card.Img variant="top" src={x} alt="product" />
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                Description:
                <p>{product.description}</p>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>${product.price}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? (
                          <Badge bg="success">In Stock</Badge>
                        ) : (
                          <Badge bg="danger">Unavailable</Badge>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button onClick={addToCartHandler} variant="primary">
                          Add To Cart
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <div>
        <h1>Product Reviews and Ratings</h1>
        {reviews?.map((r) => (
          <Card key={r._id} style={{ width: "34rem", marginTop: "1rem" }}>
            <Card.Body>
              <Card.Title className="m-0">@{r.author.toLowerCase()}</Card.Title>
              <Card.Text className="mt-2rem">{r.review}</Card.Text>
              <Card.Footer>
                <small className="text-muted mt-1rem">{r.createdAt.toString().slice(0, 10)}</small>
                {"  "}
                <small className="text-muted mb-0">{r.createdAt.toString().slice(12, 16)}</small>
              </Card.Footer>
            </Card.Body>
          </Card>
        ))}
      </div>
      <InputGroup style={{ width: "34rem", marginTop: "1rem" }}>
        <Form.Control
          as="textarea"
          aria-label="With textarea"
          onChange={(e) => setNewReview(e.target.value)}
          value={newReview}
        />
        <Button
          variant="outline-secondary"
          id="button-addon1"
          onClick={handleSubmitReview}
        >
          {!userInfo ? (
            <p className="relative">Go to Login</p>
          ) : (
            <p className="relative">Add Comment</p>
          )}
        </Button>
      </InputGroup>
    </div>
  );
}

export default ProductScreen;
