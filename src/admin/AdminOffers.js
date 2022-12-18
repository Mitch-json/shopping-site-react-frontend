import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux';
import { store } from 'react-notifications-component';
import loadingGif from '../loading.gif'

function AdminOffers(props) {
    const [products, setProducts] = useState([])
    const [load, setLoad] = useState(true)
    const userSignin = useSelector(state=> state.userSignin);
    const {loading, userInfo, error} = userSignin
    const dispatch = useDispatch();

    useEffect(() => {
        if(userInfo.isAdmin == 1){
            getProducts()
        }else{
            props.history.push('/');
        }
    }, [])

    const getProducts = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/products`).then(res => {
            if(res.ok){
              return res.json()
            } 
          }).then(data => {
              if (data.products) {
                  setProducts(data.products)
              }
              setLoad(false)
          })
          
    }

    const editOffer = (id, value)=>{
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/product/${id}/offer/add`, {
            method: 'POST',
            body: JSON.stringify({
                offer: value
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => res.json()).then(data => {
            if (data.msg) {
                
                store.addNotification({
                    title: "Message",
                    message: data.msg,
                    type: 'success',
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true
                    }
                })
                getProducts()
            }else if (data.err) {
                store.addNotification({
                    title: "Warning",
                    message: data.err,
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
        })
    }

    const removeOffer = (id)=>{
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/product/${id}/offer/remove`).then(res => {
            if(res.ok){
                return res.json()
            }
        }).then(data => {
            if (data.msg) {
                store.addNotification({
                    title: "Message",
                    message: data.msg,
                    type: 'success',
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true
                    }
                })
                getProducts()
            }else if (data.err) {
                store.addNotification({
                    title: "Warning",
                    message: data.err,
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
        })
    }

    return (
        <div className="container" style={{"margin-top": "20px"}}>
            <h2 class="page-title">Offers</h2>
            <br></br>

            <table class="table table-striped alignmiddle">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Original Price</th>
                        <th>Product image</th>
                        <th>Edit</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                {load? (<img className="loading" src={loadingGif} alt="Loading..."></img>):
                <tbody>
                    { products.map(product =>
                        <tr>
                            <td>{product.title} </td>
                            <td>Ksh {product.price} </td>
                            <td>{product.origPrice} </td>
                            <td>
                                <img id="noimage" src={product.image} alt="product"></img>
                            </td>
                            <td>
                                <select value={product.offer} onChange={(e) => editOffer(product._id, e.target.value)}>
                                        {[...Array(76).keys()].map(x =>
                                            <option key={x} value={x}>{x}</option>
                                        )}
                                </select>
                            </td>
                            <td><Link onClick={()=> removeOffer(product._id)}>Delete</Link></td>
                        </tr>
                    )
                    }
                </tbody>
                }
            </table>
        </div>
    )
}

export default AdminOffers
