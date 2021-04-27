import React, { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux';

function AdminHome(props) {
    const userSignin = useSelector(state=> state.userSignin);
    const {loading, userInfo, error} = userSignin
    const dispatch = useDispatch();

    useEffect(() => {
        if(userInfo){
            if(userInfo.isAdmin == 1){
                props.history.push('/adminArea');
            }else{
                props.history.push('/');
            }
        }
    }, [userInfo])
    return (
        <div>
            Admin Home
        </div>
    )
}

export default AdminHome
