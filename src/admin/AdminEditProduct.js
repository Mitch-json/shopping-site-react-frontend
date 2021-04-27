import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux';
import { store } from 'react-notifications-component';

function AdminEditProduct(props) {
    const [categories, setCategories] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [offer, setOffer] = useState("")
    const userSignin = useSelector(state=> state.userSignin);
    const {loading, userInfo, error} = userSignin
    const [disabled, setDisabled] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        if(userInfo.isAdmin == 1){
            getCategories()
            getProduct(props.match.params.id)
        }else{
            props.history.push('/');
        }
    }, [])

    const getProduct = (id)=>{
        fetch(`/api/product/${id}`).then(res => {
            if(res.ok){
              return res.json()
            } 
        }).then(data => {
            
            if (data.product) {
                setTitle(data.product[0].title)
                setDescription(data.product[0].description)
                setPrice(data.product[0].origPrice)
                setOffer(data.product[0].offer)
                setCategory(data.product[0].category)
            }
            if (data.err) {
                console.log(data.err)
            }
        })

    }

    const getCategories = () => {
        fetch("/api/admin/categories").then(res => {
          if(res.ok){
            return res.json()
          }
        }).then(data => {
          if (data.categories) {
            setCategories(data.categories)
          }
        })
    }
    const postProduct = (id)=>{
        fetch(`/api/products/edit/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                description: description,
                price: price,
                category: category,
                offer: offer
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => res.json()).then(data => {
            if(data.msg){
                store.addNotification({
                    title: "Info",
                    message: data.msg,
                    type: 'info',
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true
                    }
                })
                getProduct(props.match.params.id)
                props.history.push('/adminArea/products')             
            }
            else if(data.err){
                setDisabled(false)
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
    const handleFormSubmit = (e) => {
        e.preventDefault()
        setDisabled(true)
        
        if(title && description && price){
            postProduct(props.match.params.id)
        }else{

        }
    }
    return (
        <div className="container" style={{"margin-top": "20px"}}>
            <h2 class="page-title">Edit product</h2>
            <Link to="/adminArea/products" class="btn btn-primary">Back to all products</Link>
            <br></br>
            
            <form onSubmit={handleFormSubmit}>
                <div class="form-group">
                    <label for="">Title</label>
                    <input type="text" name="title" class="form-control" value={title} onChange={(e) => setTitle(e.target.value)}></input>
                </div>
                <div class="form-group">
                    <label for="">Description</label>
                    <textarea name="description" class="form-control" cols="20" rows="2" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <div class="form-group">
                    <label for="">Category</label>
                    <select name="category" class="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                        {categories.map(cat => 
                            <option value={cat.slug}>{cat.title}</option>
                        )}
                    </select>
                </div>
                <div class="form-group">
                    <label for="">Price</label>
                    <input type="text" class="form-control" name="price" value={price} onChange={(e) => setPrice(e.target.value)}></input>
                </div>
                
                <button class="btn btn-success" disabled={disabled}>Edit Product</button>
            </form>
        </div>
    )
}

export default AdminEditProduct
