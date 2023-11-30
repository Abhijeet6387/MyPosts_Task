import "./App.css";
import Login from "../src/Components/Login";
import Register from "../src/Components/Register";
import Home from "../src/Components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/" element={<Login />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
