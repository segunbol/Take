function Product(props) {
    const { product } = props;
    return (
        <div className="product" key={product.slug}>
            <Link to={`/product/${product.slug}`}>
            <img src={product.image} alt={product.name} />
            </Link>
            <div className="procuct-info">
                <Link to={`/product/${product.slug}`}>
                    <p>{product.name}</p>
                </Link>
                <p>
                    <strong>${product.price}</strong>
                </p>
                <button>Add To Cart</button>
            </div>
        </div>
    )
}

