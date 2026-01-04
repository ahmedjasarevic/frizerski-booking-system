import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Success from "./pages/Success";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <div className="app-wrapper">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/booking' element={<Booking />} />
          <Route path='/success' element={<Success />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
