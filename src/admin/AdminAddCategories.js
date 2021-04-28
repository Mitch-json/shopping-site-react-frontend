import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import {store} from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import 'animate.css'

function AdminAddCategories(props) {
    const [title, setTitle] = useState("")
    const [disabled, setDisabled] = useState(false)
    const userSignin = useSelector(state=> state.userSignin);
    const {userInfo, error} = userSignin
    const dispatch = useDispatch();

    useEffect(() => {
        if(userInfo.isAdmin == 1){
  
        }else{
            props.history.push('/');
        }
        
      }, [])

    const handleChange = (e)=>{
        setTitle(e.target.value)
    }
    
    const handleFormSubmit = (e) =>{
        e.preventDefault()
        if(title){
            setDisabled(true)
            fetch('https://api-for-mitch.herokuapp.com/api/admin/categories', {
                method: 'POST',
                body: JSON.stringify({
                    title: title
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(res => res.json()).then(msg => {
                setTitle("")
                if(msg.msg){
                    store.addNotification({
                        title: "Message",
                        message: msg.msg,
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
                    setDisabled(false)
                    props.history.push('/adminArea/categories')
                }else if (msg.err) {
                    store.addNotification({
                        title: "Warning",
                        message: msg.err,
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
                    setDisabled(false)
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
    return (
        <div className="container" style={{"margin-top": "20px"}}>
            <h2 className="page-title">Add a category</h2>
            <Link to="/adminArea/categories" class="btn btn-primary">Back to all categories</Link>
            <br></br>
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label for="">Title</label>
                    <input type="text" className="form-control" required value={title} onChange={handleChange}></input>
                </div>
                <button disabled={disabled} class="btn btn-success">Add Category</button>
            </form>
        </div>
    )
}

export default AdminAddCategories
