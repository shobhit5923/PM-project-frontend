import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import Login from "./login";
import Services from "./services";
import Reportlost from "./reportost";
import Browseitems from "./bowseitems";
import Reportfound from "./reportfound";
import Signup from "./signup";
import Claimmng from "./claimmng";
import Contact from "./contact";
import Notifications from "./notifications";
import About from "./about";
import MLExplainer from "./mlexplainer";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/services" element={<Services />} />
        <Route path="/reportlost" element={<Reportlost />} />
        <Route path="/browseitems" element={<Browseitems />} />
        <Route path="/reportfound" element={<Reportfound />} />
        <Route path="/claimmng" element={<Claimmng />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/about" element={<About />} />
        <Route path="/ai-matching" element={<MLExplainer />} />
      </Routes>
    </BrowserRouter>
  );
}
