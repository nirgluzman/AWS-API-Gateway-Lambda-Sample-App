import { Route, Routes } from "react-router-dom";

import Signin from "./components/Signin";
import Signup from "./components/Signup";

function App() {
  return (
    <div>
      <h1 className="text-center text-3xl font-serif font-bold text-blue-700">
        Compare Yourself !
      </h1>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
