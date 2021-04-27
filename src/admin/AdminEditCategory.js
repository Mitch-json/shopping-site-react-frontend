import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux';
import { store } from 'react-notifications-component';


function AdminEditCategory(props) {
    const [title, setTitle] = useState("")
    const userSignin = useSelector(state=> state.userSignin);
    const {loading, userInfo, error} = userSignin
    const [disabled, setDisabled] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        if(userInfo.isAdmin == 1){
            getProduct(props.match.params.id)
        }else{
            props.history.push('/');
        }
    }, [])

    const getProduct = (id)=>{
        fetch(`https://api-for-mitch.herokuapp.com/api/category/${id}`).then(res => {
            if(res.ok){
              return res.json()
            } 
        }).then(data => {
            
            if (data.category) {
                setTitle(data.category[0].title)
            }
            if (data.err) {
                store.addNotification({
                    title: "Error",
                    message: data.err,
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

    }

    const postProduct = (id)=>{
        fetch(`https://api-for-mitch.herokuapp.com/api/categories/edit/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                title: title,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => res.json()).then(data => {
            if(data.msg){
                store.addNotification({
                    title: "Message",
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
                props.history.push('/adminArea/categories')             
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
        if(title){
            postProduct(props.match.params.id)
        }else{

        }
    }
    return (
        <div className="container" style={{"margin-top": "20px"}}>
            <h2 class="page-title">Edit a category</h2>
            <Link to="/adminArea/categories" class="btn btn-primary">Back to all categories</Link>
            <br></br>
            
            <form onSubmit={handleFormSubmit}>
                <div class="form-group">
                    <label for="">Title</label>
                    <input type="text" name="title" class="form-control" value={title} onChange={(e) => setTitle(e.target.value)}></input>
                </div>
                
                
                <button disabled={disabled} class="btn btn-success">Edit Product</button>
            </form>
        </div>
    )
}

export default AdminEditCategory