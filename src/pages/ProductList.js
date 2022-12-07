import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Icon, Menu, Table, Card, Button, Image, Label, Popup, ItemImage, Item, ItemContent, ItemHeader, ItemDescription, ItemMeta } from 'semantic-ui-react'
import { ProductService } from '../Services/ProductService'

export default function ProductList() {

    const { category } = useParams();
    const [Products, setProducts] = useState([]);
    const [Cart, setCart] = useState([]);
    const [newArray, setnewArray] = useState([]);
    const tprice = getTotalPrice();

    useEffect(() => {
        getTotalPrice();
    }, [Cart])

    function getTotalPrice() {
        let price = 0;
        Cart.map((product) => (price += (product.price * product.quantity)));
        return price.toFixed(2);
    }

    function addToCart(productToAdd) {

        setnewArray([...Cart]);

        let a = newArray.findIndex((product) => product.productID === productToAdd.productID);
        if (a >= 0) {
            productToAdd = newArray[a];
            productToAdd.quantity += 1;
            newArray[a] = productToAdd;

            setnewArray([...newArray])
            console.log('quantity');
        }

        else {
            productToAdd.quantity = 1;
            setnewArray([...newArray, { ...productToAdd }]);
            console.log('addition');
        }
        setCart([...newArray]);

        /*
                if (productToAdd !== null && Cart.length >= 1) {
        
                    setnewArray([...Cart]);
                    let counter = 0;
        
                    newArray.map((product) => {
        
                        if (product.productID === productToAdd.productID && counter < 1) {
                            let a = newArray.findIndex((product) => product.productID === productToAdd.productID);
                            newArray[a].quantity += 1;
                            setCart([...newArray]);
                            console.log('dolu kart quantity değişikliği');
                            counter++;
                        }
        
                        else if (counter < 1) {
                            productToAdd.quantity = 1;
                            setCart([...Cart, { ...productToAdd }]);
                            setnewArray([...Cart]);
                            console.log('dolu kart ilk defa ekleme');
                            counter++;
                        }
                        console.log(counter);
                    })
                }
                else if (productToAdd !== null) {
                    productToAdd.quantity = 1;
                    setCart([...Cart, { ...productToAdd }]);
                    setnewArray([...Cart]);
                    console.log('boş carta ekleme ');
                }
                */
    }

    const removeFromCart = (productToRemove) => {

        if (productToRemove !== null) {

            setnewArray([...Cart]);
            let index = newArray.findIndex((product) => product.productID === productToRemove.productID);
            if (index >= 0) {
                productToRemove = newArray[index];

                if (productToRemove.quantity > 1) {
                    productToRemove.quantity -= 1;
                    newArray[index] = productToRemove;
                    setnewArray([...newArray]);
                    console.log('lowered quantity by 1');
                }

                else if (productToRemove.quantity === 1) {
                    setnewArray([...(newArray.filter((product) => product.productID !== productToRemove.productID))]);
                    setCart([...newArray]);
                    console.log('item removed');

                }
            }

        }
        console.log(newArray);
    }

    const clearCart = () => {
        removeFromCart(Cart.every);
    }

    useEffect(() => {

        let productService = new ProductService();

        if (!(category)) {
            productService.getProducts().then(result => setProducts(result.data.data));

        }
        else if (category) {
            productService.getProductsByCategory(category).then(result => setProducts(result.data.data));
        }

    }, [])


    function getQuantity(productID) {
        console.log(productID);

        if (Cart.length > 0 && (Cart.find((product) => (product.productID === productID)))) {
            let a = (Cart.includes((product) => (product.productID === productID))).quantity;
            return a;
        }
        else {
            return 0;
        }
    }

    return (
        <div style={{ position: 'relative' }}>
            <Popup position='bottom left' content={
                <Item.Group>
                    {Cart.map((product) => (
                        <div >
                            <div>
                                <Item key={product.productID}>
                                    <ItemImage size='tiny' src='https://mutfaksirlari.com/wp-content/uploads/2021/09/kek-pisirmenin-mutfak-sirlari-puf-noktalari.jpg' />
                                    <ItemContent>
                                        <ItemHeader>{product.productName}</ItemHeader>
                                        <ItemMeta>
                                            <div className='flex-container-vertical'>
                                                <span>{product.price} $ </span>
                                                <span> Quantity : {product.quantity}</span>
                                            </div></ItemMeta>
                                        <ItemDescription>{product.description}</ItemDescription>
                                    </ItemContent>
                                </Item>
                            </div>
                            <div>
                                <Button>sa</Button>
                            </div>
                        </div>

                    ))
                    }

                    <Button>sa</Button>

                </Item.Group>} on='click' trigger={<Button style={{ position: 'fixed', top: 6, right: 6 }} icon='shopping cart' content={tprice + ' $'} />} />
            <div className='flex-container-horizontal'>
                <div>
                    <Card.Group className='productTable' itemsPerRow={4}>

                        {
                            Products.map(product => (
                                <Card key={product.productID}
                                    style={{ backgroundColor: '#B8D9DA' }}>

                                    <Image src='https://mutfaksirlari.com/wp-content/uploads/2021/09/kek-pisirmenin-mutfak-sirlari-puf-noktalari.jpg' />
                                    <Card.Header>{product.productName}</Card.Header>
                                    <Card.Description>{product.description}</Card.Description>
                                    <Card.Content extra>

                                        <a href={'/ProductDetails' + product.productID} > Details</a>
                                        <Label className='w-100' size='big'>{product.price} $</Label>

                                        {/*  Carttaki sayısına göre ayarlanması lazım ona bir bak */}
                                        {getQuantity(product.productID) === 0 ?
                                            (<Popup on={'click'} content='Successfully added to cart!' trigger={<Button key={product.productID} color='green' className='w-100' circular icon='shopping cart' onClick={() => addToCart(product)} />} />)
                                            :
                                            (<div key={product.productID}>
                                                <div className='flex-container-horizontal' style={{ gap: ".5rem" }}>

                                                    <Popup on={'click'} content='Successfully removed from cart!' trigger={<Button size='tiny' color='red' circular onClick={() => removeFromCart(product)}>-</Button>} />

                                                    <div style={{ fontWeight: 'bold', color: 'black' }} className='fs-4'>
                                                        <span>
                                                            {product.quantity} in cart
                                                        </span>
                                                    </div>

                                                    <Popup on={'click'} content='Successfully added to cart!' trigger={<Button size='tiny' color='green' circular onClick={() => addToCart(product)}>+</Button>} />

                                                </div>

                                                <div>
                                                    <Button primary onClick={() => clearCart}>Remove</Button>
                                                </div>
                                            </div>)
                                        }

                                    </Card.Content>
                                </Card>

                            ))
                        }
                    </Card.Group>


                    <Table celled className="productTable">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Product ID</Table.HeaderCell>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Description</Table.HeaderCell>
                                <Table.HeaderCell>Unit Stock</Table.HeaderCell>
                                <Table.HeaderCell>Seller ID</Table.HeaderCell>
                                <Table.HeaderCell>Price</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {
                                Products.map(product => (
                                    <Table.Row key={product.productID}>
                                        <Table.Cell>{product.productID}</Table.Cell>
                                        <Table.Cell>{product.productName}</Table.Cell>
                                        <Table.Cell>{product.description}</Table.Cell>
                                        <Table.Cell>{product.unitStock}</Table.Cell>
                                        <Table.Cell>s</Table.Cell>
                                        <Table.Cell>{product.price}</Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </Table.Body>

                        <Table.Footer >
                            <Table.Row>
                                <Table.HeaderCell colSpan='8'>
                                    <Menu floated='right' pagination >
                                        <Menu.Item as='a' icon>
                                            <Icon name='chevron left' />
                                        </Menu.Item>
                                        <Menu.Item as='a'>1</Menu.Item>
                                        <Menu.Item as='a'>2</Menu.Item>
                                        <Menu.Item as='a'>3</Menu.Item>
                                        <Menu.Item as='a'>4</Menu.Item>
                                        <Menu.Item as='a' icon>
                                            <Icon name='chevron right' />
                                        </Menu.Item>
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                </div>






            </div>
        </div>
    )
}
