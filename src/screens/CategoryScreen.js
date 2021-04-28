import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Rating from '../components/Rating'
import loadingGif from '../loading.gif'

function CategoryScreen(props) {
    const [products, setProducts] = useState([])
    const [error, setError] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCategoryProducts(props.match.params.cat)
    }, [window.location.href])

    const getCategoryProducts = (category) => {
        fetch(`https://api-for-mitch.herokuapp.com/api/categories/${category}`).then(res => {
            if(res.ok){
                return res.json()
            }
        }).then(data => {
            if (data.products) {
                setProducts(data.products)
            }
            else if(data.err){
                console.log(data.err)
            }
            setLoading(false)
        })
        
    }

    return (
        loading? <img className="loading" src={loadingGif} alt="Loading..."></img>:
        <div className="row center">
            {
            products.map(product => 
                <div key={product._id} className="card">
                    <Link to={`product/${product._id}`}>
                        <img className="medium" src={product.image} alt="product"></img>
                    </Link>
                    <div className="card-body">
                        <Link to={`product/${product._id}`}>
                            <h2>{product.title}</h2>
                        </Link>
                        <Rating
                            rating={product.rating}
                            numReviews={product.reviews}
                        ></Rating>
                        <div className="row">
                            {product.origPrice===product.price ? <div className="price">ksh {product.price}</div> : <div className="price">ksh <p className="product-price-crossed"> {product.origPrice} </p> <p className="product-price-red"> <p className="p-p-r-p1">{product.price}</p> <p className="p-p-r-p2">{"("}{100-Math.ceil((product.price/product.origPrice)*100)}% off{")"}</p></p></div>}
                            <div>
                                <Link to={`/`}>
                                    {product.category}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </div>
    )
}

export default CategoryScreen
