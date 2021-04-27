import React, { useEffect, useState } from 'react'
import { store } from 'react-notifications-component';
import {useSelector, useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import { logout, signin } from '../actions/userActions';

function EmailVerification(props) {
    const [code, setCode] = useState('');
    const [disabled, setDisabled] = useState(false)

    const registerUser = (Name, email, password)=>{
        fetch('https://api-for-mitch.herokuapp.com/api/users/register', {
            method: 'POST',
            body: JSON.stringify({
                name: Name,
                email: email,
                password: password
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => {
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
                props.history.push('/signin')
            }else if (data.err) {
                setDisabled(false)
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
            }else if (data.exists) {
                store.addNotification({
                    title: "Warning",
                    message: data.exists,
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
                props.history.push('/register')
            }
        })
    }
    const submitHandler = (e)=>{
        e.preventDefault();
        if (code == props.location.state.code) {
            setDisabled(true)
            registerUser(props.location.state.name, props.location.state.email, props.location.state.password)
        }else{
            store.addNotification({
                title: "Warning",
                message: "Wrong Verification Entered",
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
    }

    return (
        <div>
            <form className='form' onSubmit={submitHandler}>
                    <div>
                        <h1 style={{"fontSize": "35px"}}><strong> Verify Your Email </strong></h1>
                    </div>
                    
                    <div>
                        <label htmlFor="email">
                            Verification Code
                        </label>
                        <input type="text" value={code} onChange={e => setCode(e.target.value)}/>
                    </div>
                    
                    <div>
                        <button type="submit" disabled={disabled} className="button primary">Signin</button>
                    </div>
            </form>
        </div>
    )
}

export default EmailVerification
