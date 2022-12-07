import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Image, Label } from "semantic-ui-react";
import { ProductService } from "../Services/ProductService";

const ProductDetails = () => {

    /* this part is used for routing with parameters */
    const { id } = useParams();

    const [Product, setProduct] = useState({});

    useEffect(() => {
        let productService = new ProductService();
        productService.getProductByID(id).then(result => {
            if (result && result.data) {
                setProduct(result.data.data);
                console.log(result.data.data);
            }
        });
    }, []);

    return (
        <>
            <div className="flex-container">

                <div>
                    <Image className="roundedCorner"
                        src={'https://mutfaksirlari.com/wp-content/uploads/2021/09/kek-pisirmenin-mutfak-sirlari-puf-noktalari.jpg'} />
                </div>

                <div className="flex-container-vertical" style={{ backgroundColor: '#a2dadb' }}>
                    <div className="flex-container-vertical">
                        <label style={{ margin: 'auto' }}> ProductDetails page </label>
                        <label style={{ margin: 'auto' }}> Product ID :  {Product.productID}</label>
                        <label style={{ margin: 'auto' }}> Product Name :  {Product.productName}</label>
                        <label style={{ margin: 'auto' }}> Products in Stock :  {Product.unitStock}</label>
                        <label style={{ margin: 'auto' }}> Description :  {Product.description}</label>

                    </div>

                    <Label style={{ margin: 'auto' }} >Price : {Product.price}
                        <Button color="green" icon='shopping cart' style={{ margin: 'auto' }} ></Button>
                    </Label>

                </div>
            </div>

        </>

    )

}

export default ProductDetails;
