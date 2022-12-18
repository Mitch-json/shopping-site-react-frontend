import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import loadingGif from '../loading.gif'


export default function OrderHistoryScreen(props) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userInfo) {
      props.history.push('/signin')
    }else{
      getUserOrders(userInfo._id)
    }
  }, []);

  const getUserOrders = (id) =>{
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders/${id}`).then(res => {
      if (res.ok) {
        return res.json()
      }
    }).then(data => {
      if (data.orders) {
        setOrders(data.orders)
      }
      setLoading(false)
    })
  }

  return (
    loading? <img className="loading" src={loadingGif} alt="Loading..."></img>:
    <div>
      <h1 style={{"marginBottom": "10px"}}>Order History</h1>
      
        <table className="table">
          <thead>
            <tr>
              <th>TITLE</th>
              <th>DATE</th>
              <th>TIME</th>
              <th>PRICE</th>
              <th>QTY</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.product_id}>
                <td>{order.title}</td>
                <td>{order.orderdate.substring(0, 16)}</td>
                <td>{order.orderdate.substring(17, 29)}</td>
                <td>{order.price}</td>
                <td>{order.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      
    </div>
  );
}
