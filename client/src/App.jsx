import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import Movies from './Pages/Movies'
import MovieDetails from './Pages/MovieDetails'
import SeatLayout from './Pages/SeatLayout'
import MyBookings from './Pages/MyBookings'
import Favorite from './Pages/Favorite'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import LayOut from './Pages/Admin/LayOut'
import DashBoard from './Pages/Admin/DashBoard'
import AddShow from './Pages/Admin/AddShow'
import ListShows from './Pages/Admin/ListShows'
import ListBooking from './Pages/Admin/ListBooking'
import { useAppContext } from './context/AppContext'

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin')
  const {user} = useAppContext()
  
  
  return (
    <>
        <Toaster/>
       {!isAdminRoute && <Navbar/>}
       <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/movies' element={<Movies/>}/>
          <Route path='/movies/:id' element={<MovieDetails/>}/>
          <Route path='/movies/:id/:date' element={<SeatLayout/>}/>
          <Route path='/my-bookings' element={<MyBookings/>}/>
          <Route path='/favorite' element={<Favorite/>}/>
          <Route path="/admin/*" element={<LayOut />}>
            <Route index element={<DashBoard />} />
            <Route path="add-show" element={<AddShow />} />
            <Route path="list-show" element={<ListShows />} />
            <Route path="list-bookings" element={<ListBooking />} />
          </Route>
       </Routes>
       {!isAdminRoute && <Footer/>}
    </>
  )
}

export default App