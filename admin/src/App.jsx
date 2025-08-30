import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AddItems from './components/AddItems';
import List from './components/List';
import Order from './components/Order';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AdminChat from './components/AdminChat';




const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<AddItems/>} />
        <Route path='/list' element={<List />} />
        <Route path='/orders' element={<Order />} />
        <Route path='/admin/dashboard' element={<Dashboard />} />
        <Route path="/admin/chat" element={<AdminChat  />} />
      </Routes>
    </>
  )
}

export default App
