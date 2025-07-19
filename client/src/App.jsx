import React, {useEffect} from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
const RedirectToFramer = () => {
  useEffect(() => {
    window.location.replace('https://nice-members-832678.framer.app/'); 
  }, []);
  return null;
};
function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover={true}/>
      <Routes>
        <Route path="/" element={<RedirectToFramer />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/upload" element={<Upload />} /> 
          <Route path="/record" element={<Record />} /> 
          <Route path="/transcripts/:id" element={<Transcript />} />
          <Route path="/all-transcripts" element={<AllTranscripts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;