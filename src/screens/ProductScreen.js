import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Rating from '../components/Rating'
import loadingGif from '../loading.gif'

function ProductScreen(props) {
    const [qty, setQty] = useState(1)
    const [product, setProduct] = useState([])
    const [error, setError] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getProduct(props.match.params.id)
    }, [])

    const getProduct = (id)=>{
        fetch(`https://api-for-mitch.herokuapp.com/api/product/${id}`).then(res => {
            if(res.ok){
              return res.json()
            } 
        }).then(data => {
            setProduct(data.product)

            if (data.err) {
                setError(data.err)
            }
            setLoading(false)
        })

    }

    const handleAddToCart = ()=>{
        props.history.push('/cart/'+props.match.params.id + '?qty='+qty)
    }

    return (
        <div>
            {loading? (<img className="loading" src={loadingGif} alt="Loading..."></img>):(
                <div>
                    <Link to="/">Back to all products</Link>
                    {product.map(product => 
                        <div className="row top">
                            <div className="col-2">
                                <img
                                    className="large"
                                    src={`/static/images/product_images/${product.image}`}
                                    alt={product.title}
                                ></img>
                            </div>
                            <div className="col-1">
                                <ul>
                                    <li>
                                        <h4>{product.title}</h4>
                                    </li>
                                    <li>
                                        <Rating
                                            rating={product.rating}
                                            numReviews={product.reviews}
                                        ></Rating>
                                    </li>
                                    <li>
                                        {product.origPrice===product.price ? <div className="product-price">Price: {product.price}</div> : <div className="product-price">Price: <p className="product-price-crossed"> {product.origPrice} </p> <p className="product-price-red"> <p className="p-p-r-p1">{product.price}</p> <p className="p-p-r-p2">{"("}{100-Math.ceil((product.price/product.origPrice)*100)}% off{")"}</p></p></div>}
                                    </li>
                                    <li>
                                        Description: 
                                        <p>
                                            {product.description}
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-1">
                                <div className="card card-body" style={{"margin": 0}}>
                                    <ul>
                                        <li>
                                            Category{' '}
                                            <h2>
                                            <Link to={`/`}>
                                                {product.category}
                                            </Link>
                                            </h2>
                                            <Rating
                                                rating={product.rating}
                                                numReviews={product.reviews}
                                            ></Rating>
                                        </li>
                                        <li>
                                            <div className="row">
                                                <div>Price</div>
                                                <div className="price">Ksh {product.price}</div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="row">
                                                <div>Status</div>
                                                <div>
                                                    {product.countInStock > 0 ? (
                                                    <span className="success">In Stock</span>
                                                    ) : (
                                                    <span className="danger">Unavailable</span>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                        
                                        {product.countInStock > 0 && (
                                            <>
                                            <li>
                                                <div className="row">
                                                    <div>Qty</div>
                                                    <div>
                                                        <select
                                                            value={qty}
                                                            onChange={(e) => setQty(e.target.value)}
                                                            >
                                                            {[...Array(product.countInStock).keys()].map(
                                                                (x) => (
                                                                    <option key={x + 1} value={x + 1}>
                                                                        {x + 1}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={handleAddToCart}
                                                    className="primary block"
                                                    >
                                                    Add to Cart
                                                </button>
                                            </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>
                </div>

                )}
                </div>)
            }
        </div>
    )
}

export default ProductScreen

