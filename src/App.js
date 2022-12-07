import './App.css';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import Navi from './layouts/Navi';
import Login from './pages/Login'
import Register from './pages/Register'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CartSummary from './layouts/CartSummary'
import Category from './pages/Category'
import ProductAdd from './pages/ProductAdd';
import UserList from './pages/UserList';
import UserEdit from './pages/UserEdit';
import ProductDetails from './pages/ProductDetails';
import ProductList from './pages/ProductList';


export default function App() {

  return (

    <div className="App" style={{ position: 'relative', backgroundColor: '#5f9ea0' }}>

      <Navi className="navbar" style={{ position: 'fixed' }} />
      <Container className="main">
      </Container>

      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path='/Register' exact={true} element={<Register />} />
          <Route path='/Login' exact={true} element={<Login />} />
          <Route path='/UserList' exact={true} element={<UserList />} />
          <Route path='/CartSummary' exact={true} element={<CartSummary />} />
          <Route path='/Category' exact={true} element={<Category />} />
          <Route path='/ProductAdd' exact={true} element={<ProductAdd />} />
          <Route path='/ProductList:category' exact={true} element={<ProductList />} />
          <Route path='/UserEdit' exact={true} element={<UserEdit />} />
          <Route path='/ProductDetails:id' exact={true} element={<ProductDetails />} />
        </Routes>
      </Router>
    </div>
  );
}
