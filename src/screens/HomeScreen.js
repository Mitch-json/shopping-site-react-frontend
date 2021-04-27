import React, { useEffect, useState } from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel'
import { Link } from 'react-router-dom'
import Rating from '../components/Rating'
import loadingGif from '../loading.gif'

function HomeScreen() {
    const [products, setProducts] = useState([])
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getProducts()
    }, [])

    const getProducts = () => {
        fetch("/api/admin/products").then(res => {
            if(res.ok){
              return res.json()
            } 
          }).then(data => {
              if (data.products) {
                  getOfferProducts()
                  setProducts(data.products)
              }
              setLoading(false)
          })
          
    }
    const getOfferProducts = () => {
        fetch("/api/products/offer").then(res => {
            if(res.ok){
              return res.json()
            } 
          }).then(data => {
              if (data.products_with_offer) {
                  setOffers(data.products_with_offer)
              }
          })
          
          setLoading(false)
    }

    return (
        loading? <img className="loading" src={loadingGif} alt="Loading..."></img>:(
        <div>
            <h2 style={{"color": "red"}}>Products on Offer</h2>
            {!offers ? <h4>No Offers</h4> :
            <Carousel className="carousel" showArrows autoPlay infiniteLoop showThumbs={false}>
                {offers.map((product) => (
                    <div className="carousel-div" style={{"height": 350}} key={product._id}>
                        <Link to={`product/${product._id}`}>
                            <img style={{"maxHeight": 320, "objectFit": "contain"}} src={`/static/images/product_images/${product.image}`} alt={product.title} />
                            <p className="legend">{product.title}</p>
                        </Link>
                    </div>
                ))}
            </Carousel>
            }
            <h2>Featured Products</h2>
            <div className="row center">
                {
                products.map(product => 
                    <div key={product._id} className="card">
                        <Link to={`product/${product._id}`}>
                            <img className="medium" src={`/static/images/product_images/${product.image}`} alt="product"></img>
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
        </div>)
    )
}

export default HomeScreen
