import Axios from "axios";
import Cookie from 'js-cookie';
import { CART_ADD_ITEM, CART_EMPTY, CART_REMOVE_ITEM } from "../constants/cartConstants";

const addToCart = (productId, qty) => async (dispatch, getState) => {
    try {
        const {data} = await Axios.get('https://api-for-mitch.herokuapp.com/api/product/'+productId);

        dispatch({type: CART_ADD_ITEM, payload:{
            product: data.product[0]._id,
            name: data.product[0].title,
            image: data.product[0].image,
            price: data.product[0].price,
            countInStock: data.product[0].countInStock,
            qty
        }});
        const {cart:{cartItems}} = getState();
        Cookie.set('cartItems', JSON.stringify(cartItems));
    } catch (error) {
        
    }
}

const removeFromCart = (productId)=> (dispatch, getState) => {
    dispatch({type: CART_REMOVE_ITEM, payload: productId});

    const {cart:{cartItems}} = getState();
    Cookie.set('cartItems', JSON.stringify(cartItems));
}

const removeAllFromCart = () => (dispatch, getState) =>{
    dispatch({type: CART_EMPTY})
    const {cart:{cartItems}} = getState();
    Cookie.set('cartItems', JSON.stringify(cartItems));
}

export {addToCart, removeFromCart, removeAllFromCart}