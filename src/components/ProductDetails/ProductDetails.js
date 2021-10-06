import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { AuthContext } from "../../common/context/Auth.context";

import { CartContext } from "../../common/context/Cart.context";
import axiosInstance from "../../common/http/index";

import {
  Col,
  Container,
  Image,
  Row,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import "./ProductDetails.css";

const ProductDetails = () => {
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState([]);
  const [setErrorMessage] = useState(undefined);
  const { cart, setCart, setCount } = useContext(CartContext);

  const { id } = useParams();

  const storedToken = localStorage.getItem("authToken");

  const handleCartItem = () => {
    /* id carrito y id producto */
    if (product && cart) {
      const body = { productId: product._id, cartId: cart._id };
      axiosInstance
        .post(`/api/cart/add-item`, body, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => {
          setCart(response.data);
          alert("product added");
        });
    }
  };

  useEffect(() => {
    if (cart) {
      setCount(cart.products.length);
    }
  });

  useEffect(() => {
    axiosInstance
      .get(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <Container id="product-details">
        <Row className="justify-content-center">
          <Col xs={12} md={6} xl={4} className="m-3 mt-0">
            <Image
              src={product.imageUrl}
              alt="Product Name"
              className="w-100"
            />
          </Col>
          <Col xs={12} md={6} xl={6} className="m-3 mt-0">
            <h3 className="heading">{product.name}</h3>
            <p className="text-muted">{product.brand} </p>
            <p className="product-description">{product.description} </p>
            <p className="product-price">{product.totalPrice} €</p>
            {user && (
              <Form onSubmit={(e) => e.preventDefault()}>
                <Button
                  variant="success"
                  onClick={handleCartItem} //TODO: check this later
                  type="submit"
                  size="lg"
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="me-3" />
                  Add to cart
                </Button>
                <input type="hidden" value={product.id} name="productId" />
              </Form>
            )}
            {!user && (
              <>
                <Alert variant="warning">
                  You must be
                  <Link to={`/my-account`}> logged in</Link> to purchase
                </Alert>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductDetails;
