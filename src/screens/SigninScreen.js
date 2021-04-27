import React, { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import { logout, signin } from '../actions/userActions';
import { store } from 'react-notifications-component';

function SigninScreen(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const userSignin = useSelector(state=> state.userSignin);
    const {loading, userInfo, error} = userSignin
    const dispatch = useDispatch();

    const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/';

    useEffect(() => {
        if(userInfo){
            if(userInfo.isAdmin == 1){
                props.history.push('/adminArea');
            }else{
                props.history.push(redirect);
            }
        }
        return () => {
            
        }
    }, [userInfo]);
    
    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(signin(email, password))
    }

    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1 style={{"fontSize": "35px"}}><strong> Sign In </strong></h1>
                
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
                    <label />
                    <button className="primary" disabled={loading} type="submit">
                        Sign In
                    </button>
                </div>
                <div>
                    <label />
                    <div>
                        New customer?{' '}
                        <Link to={`/register?redirect=${redirect}`}>
                        Create your account
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SigninScreen
