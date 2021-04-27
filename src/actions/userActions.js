import Axios from "axios";
import Cookie from 'js-cookie';
import { store } from "react-notifications-component";
import {
  USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS,
  USER_SIGNIN_FAIL, USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_LOGOUT, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL
} from "../constants/userConstants";

const update = ({ userId, name, email, password }) => async (dispatch, getState) => {
  const { userSignin: { userInfo } } = getState();
  dispatch({ type: USER_UPDATE_REQUEST, payload: { userId, name, email, password } });
  try {
    const { data } = await Axios.put("/api/users/" + userId,
      { name, email, password }, {
      headers: {
        Authorization: 'Bearer ' + userInfo.token
      }
    });
    dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
    Cookie.set('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({ type: USER_UPDATE_FAIL, payload: error.message });
  }
}

const signin = (email, password) => async (dispatch) => {
  dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
  try {
    const { data } = await Axios.post("/api/users/signin", { email, password, });
    if(data.err){
      dispatch({ type: USER_SIGNIN_FAIL, payload: data.err });
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
    }else if (data.sus) {
      dispatch({ type: USER_SIGNIN_FAIL, payload: data.sus });
      store.addNotification({
        title: "Error",
        message: data.sus,
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
    else{
      dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
      Cookie.set('userInfo', JSON.stringify(data));
    }
  } catch (error) {
    dispatch({ type: USER_SIGNIN_FAIL, payload: "Something Went Wrong" });
  }
}

const register = (name, email, password) => async (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST, payload: { name, email, password } });
  try {
    const { data } = await Axios.post("/api/users/register", { name, email, password });
    if(data.err){
      dispatch({ type: USER_REGISTER_FAIL, payload: data.err });
    }else{
      dispatch({ type: USER_REGISTER_SUCCESS});
    }
  } catch (error) {
    dispatch({ type: USER_REGISTER_FAIL, payload: "Failed To Register User" });
  }
}

const logout = () => (dispatch) => {
  Cookie.remove("userInfo");
  dispatch({ type: USER_LOGOUT })
  document.location.href = '/'
}
export { signin, register, logout, update };