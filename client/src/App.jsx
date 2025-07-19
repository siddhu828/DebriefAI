import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from './layout/MainLayout'
import Upload from "./pages/Upload";
import Record from "./pages/Record";
import Transcript from "./pages/Transcript";
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'
import AllTranscripts from "./pages/AllTranscripts";
import useAuthStore from "./store/authStore";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const token = useAuthStore((state) => state.token);
  
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000}  pauseOnHover={true}/>
      <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
        <Route path="/dashboard" element={token ? <Dashboard /> :<Navigate to="/login"/>}  />
          <Route
            path="/profile"
            element={token ? <Profile /> :<Navigate to="/login"/>}
          />
          <Route
            path="/settings" element={token ?  <Settings /> :<Navigate to="/login"/>} 
          />
          <Route path='/upload' element={token ? <Upload /> :<Navigate to="/login"/>} /> 
          <Route path='/record' element={token ? <Record /> :<Navigate to="/login"/>} /> 
          <Route path='/transcripts/:id' element={token ? <Transcript /> :<Navigate to="/login"/>} />
          <Route path='all-transcripts' element={token ? <AllTranscripts /> :<Navigate to="/login"/>} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
/* abhi ke liye i'm removing the guarding login, i.e Navigate to='/login', which prevents access to pages aese hi. Rn i'm removing it cause koi aur page khol hi nahi paa raha ;(. ek example daal raha hun idhar so that later daal dun: element={user ? <Settings /> : <Navigate to="/login" />} */ 
export default App