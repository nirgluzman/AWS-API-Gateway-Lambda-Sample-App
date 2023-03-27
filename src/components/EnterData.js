import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserAuth } from "../context/AuthContext";

import axios from "axios";

const EnterData = () => {
  const [age, setAge] = useState(null);
  const [height, setHeight] = useState(null);
  const [income, setIncome] = useState(null);
  const [error, setError] = useState("");

  const { isAuthenticated } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const idToken = await isAuthenticated();
      console.log(idToken);

      const result = await axios.post(
        process.env.REACT_APP_API_URL,
        {
          age: Number(age),
          height: Number(height),
          income: Number(income),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: idToken,
          },
        }
      );
      console.log(result);
      // navigate(`/signup-confirm/${username}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-[700px] mx-auto my-16 p-4">
      {error && (
        <div role="alert">
          <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
            ERROR
          </div>
          <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
            <p>{error}</p>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold py-2">Set your Data</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col py-2">
          <label className="py-2 font-medium">Age:</label>
          <input
            onChange={(e) => setAge(e.target.value)}
            className="border p-3"
            type="number"
          />
        </div>
        <div className="flex flex-col py-2">
          <label className="py-2 font-medium">Height [cm]:</label>
          <input
            onChange={(e) => setHeight(e.target.value)}
            className="border p-3"
            type="number"
          />
        </div>
        <div className="flex flex-col py-2">
          <label className="py-2 font-medium">Monthly Income [Euro]:</label>
          <input
            onChange={(e) => setIncome(e.target.value)}
            className="border p-3"
            type="number"
          />
        </div>
        <button className="border border-blue-500 bg-blue-600 hover:bg-blue-500 w-full p-4 my-2 text-white">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EnterData;
