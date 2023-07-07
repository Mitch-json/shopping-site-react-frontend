/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AdminAddCategories from './admin/AdminAddCategories';
import AdminAddProduct from './admin/AdminAddProduct';
import AdminAllUsers from './admin/AdminAllUsers';
import AdminCategories from './admin/AdminCategories';
import AdminEditCategory from './admin/AdminEditCategory';
import AdminEditProduct from './admin/AdminEditProduct';
import AdminHome from './admin/AdminHome';
import AdminOffers from './admin/AdminOffers';
import AdminProducts from './admin/AdminProducts';
import CartScreen from './screens/CartScreen';
import CategoryScreen from './screens/CategoryScreen';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SigninScreen from './screens/SigninScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import { logout } from './actions/userActions';
import { removeAllFromCart } from './actions/cartActions';
import EmailVerification from './screens/EmainVerification';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import {store} from 'react-notifications-component'
import 'animate.css'
 
function App() {
  const [categories, setCategories] = useState([]);
  const userSignin = useSelector(state => state.userSignin);
  const {userInfo} = userSignin;
  
  const cart = useSelector(state => state.cart);
  const {cartItems} = cart;
  const dispatch = useDispatch();
  

  useEffect(() => {
    
    getCategories()
    
  }, [cartItems, userInfo, dispatch])

  const getCategories = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/categories`).then(res => {
      if(res.ok){
        return res.json()
      }
    }).then(data => {
      if (data.categories) {
        setCategories(data.categories)
      }
    })
  }

  const openMenu = ()=>{
    document.querySelector('.sidebar').classList.add('open');
    
  }
  const closeMenu = ()=>{
    document.querySelector('.sidebar').classList.remove('open');
  }

  const signoutHandler = () => {
    dispatch(logout());
    dispatch(removeAllFromCart())
  }


  return (
    <Router>
      <ReactNotification />
      <div className="grid-container">
      {window.location.href.indexOf("adminArea") > -1 ? 
         <header className="header">
              <div className="brand">
                  <button>
                      &#9776;
                  </button>
                  
                  <Link to="/adminArea">Mitch.com</Link>
              </div>
              <div className="header-middle-links">
                  <Link to="/adminArea/categories">Categories</Link>
                  <Link to="/adminArea/products">Products</Link>
                  <Link to="/adminArea/offers">Offers</Link>
                  <Link to='/adminArea/users'>All Users</Link>
              </div>
              <div className="header-links">
                  
                  {userInfo ? (
                  <div className="dropdown">
                    <Link to="#">
                      Admin ({userInfo.name}) <i className="fa fa-caret-down"></i>{' '}
                    </Link>
                    <ul className="dropdown-content">
                      
                      <li>
                        <Link to="#signout" onClick={signoutHandler}>
                          Sign Out
                        </Link>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <Link to="/signin">Sign In</Link>
                )}
              </div>
          </header>
        
        :

        <header className="header">
            <div className="brand">
                <button onClick={openMenu}>
                    &#9776;
                </button>
                
                <Link to="/">Mitch.com</Link>
            </div>
            <div className="header-links">
                <Link to='/cart/1?'>
                  <i class="fas fa fa-shopping-cart fa-lg">
                  </i>
                  {cartItems.length > 0 && (
                    <span className="badge">{cartItems.length}</span>
                  )}
                </Link>
                {userInfo ? (
                  <div className="dropdown">
                    <Link to="#">
                      {userInfo.name} <i className="fa fa-caret-down"></i>{' '}
                    </Link>
                    <ul className="dropdown-content">
                    
                      <li>
                        <Link to={`/user/${userInfo._id}/orders`}>Order History</Link>
                      </li>
                      <li>
                        <Link to="#signout" onClick={signoutHandler}>
                          Sign Out
                        </Link>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <Link to="/signin">Sign In</Link>
                )}
                
            </div>
        </header>
      }
        <aside className="sidebar">
            
            <ul className="list-group">
              <li>
                <strong>Categories</strong>
                <button
                  onClick={closeMenu}
                  className="close-sidebar"
                  type="button"
                >
                  <i className="fa fa-close"></i>
                </button>
              </li>
                {
                  categories.map(category=> 
                    <li key={category._id} className="list-group-item">
                       <Link to={`/products/category/${category.slug}`}>{category.title}</Link>
                    </li>  
                  )
                }
            </ul>
        </aside>
        <main className="main">
            <div className="content">
              <Route path="/signin" exact component={SigninScreen}></Route>
              <Route path="/register" exact component={RegisterScreen}></Route>
              <Route path={`/products/category/:cat`} exact component={CategoryScreen}></Route>
              <Route path="/product/:id" exact component={ProductScreen}></Route>
              <Route path="/cart/:id?" exact component={CartScreen}></Route>
              <Route path="/user/:id/orders" exact component={OrderHistoryScreen}></Route>
              <Route path="/shipping" component={ShippingAddressScreen}></Route>
              <Route path="/email-verification" component={EmailVerification}></Route>
              <Route path="/" exact component={HomeScreen}></Route>

              <Route path="/adminArea" exact component={AdminHome}></Route>
              <Route path="/adminArea/products" exact component={AdminProducts}></Route>
              <Route path="/adminArea/categories" exact component={AdminCategories}></Route>
              <Route path="/adminArea/categories/add-category" exact component={AdminAddCategories}></Route>
              <Route path="/adminArea/products/add-product" exact component={AdminAddProduct}></Route>
              <Route path="/adminArea/products/edit-product/:id" exact component={AdminEditProduct}></Route>
              <Route path="/adminArea/categories/edit-category/:id" exact component={AdminEditCategory}></Route>
              <Route path="/adminArea/offers" exact component={AdminOffers}></Route>
              <Route path="/adminArea/users" exact component={AdminAllUsers}></Route>
              
            </div>
        </main>
        <footer className="footer">
            All rights reserved
        </footer>
      </div>
    </Router>
  );
}

export default App;
