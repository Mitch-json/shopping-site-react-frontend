import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux';
import { store } from 'react-notifications-component';
import loadingGif from '../loading.gif'


function AdminCategories(props) {
    const [categories, setCategories] = useState([]);
    const [loading,setLoading] = useState(true)
    const userSignin = useSelector(state=> state.userSignin);
    const {userInfo} = userSignin
  
    useEffect(() => {
      
      if(userInfo.isAdmin == 1){
        getCategories()
      }else{
          props.history.push('/');
      }
      
    }, [])
  
    const getCategories = () => {
      fetch("https://api-for-mitch.herokuapp.com/api/admin/categories").then(res => {
        if(res.ok){
          return res.json()
        }
      }).then(data => {
        if (data.categories) {
          setCategories(data.categories)
        }
        setLoading(false)
      })
  
    }
    const handleDetete = (id) =>{
        fetch(`https://api-for-mitch.herokuapp.com/api/categories/delete/${id}`).then(res => {
          if (res.ok) {
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
          getCategories()
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
            <h2 class="page-title">Categories</h2>
            <Link to="/adminArea/categories/add-category" class="btn btn-primary">Add a category</Link>
            <br></br>
            <table class="table table-striped alignmiddle">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                {loading? (<img className="loading" src={loadingGif} alt="Loading..."></img>):
                <tbody>
                    { categories.map(category =>
                        <tr>
                            <td>{category.title} </td>
                            <td><Link to={`/adminArea/categories/edit-category/${category._id}`}>Edit</Link></td>
                            <td><Link onClick={(e) => {handleDetete( category._id)}}>Delete</Link></td>
                        </tr>
                    )
                    }
                </tbody>
                }
            </table>
        </div>
    )
}

export default AdminCategories
