import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux';
import { store } from 'react-notifications-component';
import loadingGif from '../loading.gif'
import {Image} from 'cloudinary-react'

function AdminProducts(props) {
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

    const deleteProduct = (id)=>{
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/delete/${id}`).then(res => {
            if (res.ok) {
                return res.json()
            }
        }).then(data => {
            if(data.msg){
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
            }else if(data.err){
                store.addNotification({
                    title: "Error",
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
            getProducts()
        })
    }

    const handleDetete = (fName, id) =>{
        deleteProduct(id)
    }

    return (
        <div className="container" style={{"margin-top": "20px"}}>
            <h2 class="page-title">Products</h2>
            <Link to="/adminArea/products/add-product" class="btn btn-primary">Add a product</Link>
            <br></br>

            <table class="table table-striped alignmiddle">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Product image</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                {load? (<img className="loading" src={loadingGif} alt="Loading..."></img>):
                
                <tbody>
                    { products.map(product =>
                        <tr>
                            <td>{product.title} </td>
                            <td>Ksh {product.price} </td>
                            <td>{product.category} </td>
                            <td>
                                <img id="noimage" src={product.image} alt="product"></img>
                            </td>
                            <td><Link to={`/adminArea/products/edit-product/${product._id}`}>Edit</Link></td>
                            <td><Link onClick={(e) => {handleDetete(product.image, product._id)}}>Delete</Link></td>
                        </tr>
                    )
                    }
                </tbody>
                }
            </table>
        </div>
    )
}

export default AdminProducts
