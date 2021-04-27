import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux';
import { store } from 'react-notifications-component';


function AdminAddProduct(props) {
    const [categories, setCategories] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [image, setImage] = useState()
    const [imageUrl, setImageUrl] = useState("")
    const userSignin = useSelector(state=> state.userSignin);
    const {userInfo, error} = userSignin
    const [disabled, setDisabled] = useState(false)
    const dispatch = useDispatch();

    let rating;
    let reviews;

    useEffect(() => {
        if(userInfo.isAdmin == 1){
            getCategories()
        }else{
            props.history.push('/');
        }
        
    }, [])

    const getCategories = () => {
        fetch("/api/admin/categories").then(res => {
          if(res.ok){
            return res.json()
          }
        }).then(data => {
          if (data.categories) {
            setCategories(data.categories)
            setCategory(data.categories[0].slug)
          }
        })
    }

    const postProduct = ()=>{
        fetch('/api/admin/products', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                description: description,
                price: price,
                category: category,
                image: imageUrl,
                rating: rating,
                reviews: reviews
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => res.json()).then(data => {
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
                props.history.push('/adminArea/products')
                setImage('')
                setImageUrl('')
                setTitle('')
                setCategory('')
                setPrice('')
                setDescription('')
                rating = undefined
                reviews = undefined                
            }
            else if(data.err){
                handleDetete(imageUrl)
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
        const fd = new FormData()
        fd.append('file', image)

        const x = Math.random() * (5.0-2.3) + 2.3
        reviews = Math.floor((Math.random() * 200))
        rating = x.toFixed(1)
        
        if(title && description && price && imageUrl){
            axios.post('/upload-image',fd).then(res => {
                if(res.data.msg){
                    store.addNotification({
                        title: "Info",
                        message: res.data.msg,
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
                    postProduct()
                }else if(res.data.err){
                    store.addNotification({
                        title: "Error",
                        message: res.data.err,
                        type: 'danger',
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
        }else{
            store.addNotification({
                title: "Error",
                message: "Please fill all the fields",
                type: 'danger',
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
    }
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            
            const reader = new FileReader();
                reader.onload = ()=>{
                    const imgP = document.querySelector('.image-p')
                    const img = new Image();
                    img.onload = ()=>{
                        img.style.maxHeight = '200px';
                        img.style.maxWidth = '200px';
                        img.style.height = 'auto';
                        img.style.width = 'auto';
                        img.style.margin = '20px';
                    }
                    img.src = reader.result;
                    imgP.appendChild(img);
                }
    
            reader.readAsDataURL(e.target.files[0])
    
            setImage(e.target.files[0])
            setImageUrl(e.target.files[0].name)
        }
       
    }

    const handleDetete = (fName) =>{
        fetch(`/delete-image/${fName}`).then(res => {
            if (res.ok) {
                return res.json()
            }
        }).then(data => {
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
            }else if(data.err){
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
            <h2 class="page-title">Add a product</h2>
            <Link to="/adminArea/products" class="btn btn-primary">Back to all products</Link>
            <br></br>
            <form onSubmit={handleFormSubmit}>
                <div class="form-group">
                    <label for="">Title</label>
                    <input type="text" name="title" class="form-control" value={title} onChange={(e) => setTitle(e.target.value)}></input>
                </div>
                <div class="form-group">
                    <label for="">Description</label>
                    <textarea name="description" class="form-control" rows="2" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <div class="form-group">
                    <label for="">Category</label>
                    <select name="category" value={category} class="form-control" onChange={e => {console.log(e.target.value); setCategory(e.target.value)}}>
                        {categories.map(cat => 
                            <option value={cat.slug}>{cat.title}</option>
                        )}
                    </select>
                </div>
                <div class="form-group">
                    <label for="">Price</label>
                    <input type="text" class="form-control" name="price" value={price} onChange={(e) => setPrice(e.target.value)}></input>
                </div>
                <div class="form-group image-p">
                    <label for="">Image</label>
                    <input type="file" class="form-control" name="image" id="img" onChange={handleFileChange}></input>
                </div>
                <button class="btn btn-success" disabled={disabled}>Add Product</button>
            </form>
        </div>
    )
}

export default AdminAddProduct
