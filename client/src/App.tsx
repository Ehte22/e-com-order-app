import React from 'react'

import './index.scss'
import { Outlet, Route, Routes } from 'react-router-dom'
import Orders from './pages/Orders'
import OrderSuccess from './pages/OrderSuccess'

const App = () => {

  return <>
    <Routes>
      <Route path='/' element={<><Outlet /></>}>
        <Route index element={<Orders />} />
        <Route path='success' element={<OrderSuccess />} />
      </Route>
    </Routes>
  </>
}

export default App