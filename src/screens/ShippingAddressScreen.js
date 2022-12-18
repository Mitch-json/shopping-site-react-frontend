import React, { useEffect, useState } from 'react';
import { store } from 'react-notifications-component';
import { useDispatch, useSelector } from 'react-redux';
import {removeAllFromCart} from '../actions/cartActions'


export default function ShippingAddressScreen(props) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const cart = useSelector(state => state.cart);
  const {cartItems} = cart;
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false)

  if (!userInfo) {
    props.history.push('/signin');
  }
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    getUserAddress(userInfo._id)
  }, [cartItems])

  const getUserAddress = (id) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/shipping/address/${id}`).then(res => {
      if(res.ok){
        return res.json()
      }
    }).then(data => {
      if(data.address){
        placeOrder(cartItems, id)
        props.history.push(`/user/${id}/orders`)
      }
    })
  }
  
  const setShippingAddress = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/shipping/address/${userInfo._id}`, {
      method: "POST",
      body: JSON.stringify({
        fullName: fullName,
        address: address,
        city: city,
        postalCode: postalCode,
        country: country
      }),
      headers: {
          "Content-type": "application/json; charset=UTF-8"
      }
    }).then(res => {
      if (res.ok) {
        return res.json()
      }
    }).then(data =>{
      placeOrder(cartItems, userInfo._id)
    })
  }

  const placeOrder = (cartItems, id) => {
    const products = []
    cartItems.forEach(item => {
      const prod = {}
      prod.userId = id
      prod.productId = item.product
      prod.title = item.title
      prod.price = item.price * item.qty
      prod.qty = item.qty
      prod.countInStock = item.countInStock
      products.push(prod)
    })
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders/${id}`, {
        method: "POST",
        body: JSON.stringify({
          products: products
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
      }).then(res => {
        if (res.ok) {
          return res.json()
        }
      }).then(data =>{
        if(data.msg){
          dispatch(removeAllFromCart())
          props.history.push(`/user/${id}/orders`)
        }
      })
    
  }

  const submitHandler = (e) => {
    e.preventDefault();
    if(fullName && address && city && postalCode && country){
      setDisabled(true)
      setShippingAddress()
    }else{
      setDisabled(false)
      store.addNotification({
          title: "Warning",
          message: "Please fill all the fields",
          type: 'warning',
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true
          }
      })
    }
    
  };
  
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1 style={{"fontSize": "35px"}}><strong>Shipping Address</strong></h1>
        </div>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            placeholder="Enter postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            placeholder="Enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label />
          <button className="button primary full-width" disabled={disabled} type="submit">
            Confirm Order
          </button>
        </div>
      </form>
    </div>
  );
}
