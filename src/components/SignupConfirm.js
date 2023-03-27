import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { UserAuth } from "../context/AuthContext";

const SignupConfirm = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const { confirmUser } = UserAuth();

  const navigate = useNavigate();

  const { username } = useParams(); // Get username from URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await confirmUser(username, code);
      console.log("confirming the new created user:", result);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-[700px] mx-auto my-16 p-4">
      {error && (
        <div role="alert">
          <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
            ERROR
          </div>
          <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
            <p>{error}</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold py-2">Email Confirmation</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col py-2">
          <label className="py-2 font-medium">Code:</label>
          <input
            onChange={(e) => setCode(e.target.value)}
            className="border p-3"
            type="number"
          />
        </div>
        <button className="border border-blue-500 bg-blue-600 hover:bg-blue-500 w-full p-4 my-2 text-white">
          Verify
        </button>
      </form>
    </div>
  );
};

export default SignupConfirm;
