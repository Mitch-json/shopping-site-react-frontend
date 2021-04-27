import React, { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux';
import loadingGif from '../loading.gif'

function AdminAllUsers(props) {
    const userSignin = useSelector(state=> state.userSignin);
    const {userInfo, error} = userSignin
    const [users, setUsers] = useState([])
    const [load, setLoad] = useState(true)
  
    useEffect(() => {
      if(userInfo.isAdmin == 1){
        getAllusers()
      }else{
          props.history.push('/');
      }
      
    }, [])


    const getAllusers = ()=>{
        fetch('https://api-for-mitch.herokuapp.com/api/admin/users').then(res=>{
            if (res.ok) {
                return res.json()
            }
        }).then(data=>{
            if(data.users){
                setUsers(data.users)
            }else if(data.err){
                console.log(data.err)
            }
            setLoad(false)
        })
    }

    const changeAdmin = (prev, id) =>{
        if(prev == 1){
            fetch(`https://api-for-mitch.herokuapp.com/api/admin/user/isAdmin/${id}/0`).then(res => {
                if (res.ok) {
                    return res.json()
                }
            }).then(data=> getAllusers())
        }else if(prev == 0){
            fetch(`https://api-for-mitch.herokuapp.com/api/admin/user/isAdmin/${id}/1`).then(res => {
                if (res.ok) {
                    return res.json()
                }
            }).then(data=> getAllusers())
        }
    }

    const changeSuspended = (prev, id) =>{
        if(prev == 1){
            fetch(`https://api-for-mitch.herokuapp.com/api/admin/user/suspended/${id}/0`).then(res => {
                if (res.ok) {
                    return res.json()
                }
            }).then(data=> getAllusers())
        }else if(prev == 0){
            fetch(`https://api-for-mitch.herokuapp.com/api/admin/user/suspended/${id}/1`).then(res => {
                if (res.ok) {
                    return res.json()
                }
            }).then(data=> getAllusers())
        }
    }
    
    return (
        <div>
      <h1 style={{"marginBottom": "10px"}}><strong> All Users</strong></h1>
      
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Suspended</th>
            </tr>
          </thead>
          {load? (<img className="loading" src={loadingGif} alt="Loading..."></img>):
          <tbody>
            {users.map(user => 
                user.email == 'mitchjaga@gmail.com'? console.log("admin"):
                    (<tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                            {user.isAdmin == 1 ? <button onClick={(e)=> changeAdmin(user.isAdmin, user._id)} className="success">Yes</button> : <button onClick={(e)=> changeAdmin(user.isAdmin, user._id)}>No</button>}
                        </td>
                        <td>
                            {user.suspended == 1 ? <button onClick={(e)=> changeSuspended(user.suspended, user._id)} className="danger">Yes</button> : <button onClick={(e)=> changeSuspended(user.suspended, user._id)}>No</button>}
                        </td>
                    </tr>)          
            )}
          </tbody>
            }
        </table>
      
    </div>
    )
}

export default AdminAllUsers
