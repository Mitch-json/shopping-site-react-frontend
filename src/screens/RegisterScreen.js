import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../actions/userActions';
import GenerateRandomCode from 'react-random-code-generator'
import { store } from 'react-notifications-component';

function RegisterScreen(props) {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const userSignin = useSelector(state=> state.userSignin);
  const {loading, userInfo, error} = userSignin
  const [disabled, setDisabled] = useState(false)
  const dispatch = useDispatch();

  const redirect = props.location.search ? props.location.search.split("=")[1] : '/';
  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
    return () => {
      //
    };
  }, [props.history, redirect, userInfo]);

  const sendMail = (code, name, email, password)=>{
    fetch(`/api/email`, {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            code: code
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
        props.history.push({
          pathname: '/email-verification',
          state: {name: name, email: email, password: password, code: code}
        })
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
      }
    })
  }
  
  

  const submitHandler = (e) => {
    e.preventDefault();
    setDisabled(true)
    if(password == rePassword){
      const code = GenerateRandomCode.NumCode(6)
      sendMail(code, name, email, password)
    }else{
      console.log("passwords dont match")
      setDisabled(false)
    }
  }
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1 style={{"fontSize": "35px"}}><strong> Create Account </strong></h1>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter name"
            required
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Enter confirm password"
            required
            onChange={(e) => setRePassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label />
          <button className="primary" disabled={disabled} type="submit">
            Register
          </button>
        </div>
        <div>
          <label />
          <div>
            Already have an account?{' '}
            <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
          </div>
        </div>
      </form>

  </div>)
}
export default RegisterScreen;