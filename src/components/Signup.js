import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { UserAuth } from "../context/AuthContext";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { createUser } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await createUser(username, email, password);
      navigate(`/signup-confirm/${username}`);
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

      <div>
        <h1 className="text-2xl font-bold py-2">Sign up for a free account</h1>
        <p className="py-2">
          Already have an account?{" "}
          <Link to="/" className="underline">
            Sign in
          </Link>
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col py-2">
          <label className="py-2 font-medium">Username:</label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            className="border p-3"
            type="text"
          />
        </div>
        <div className="flex flex-col py-2">
          <label className="py-2 font-medium">Email Address:</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3"
            type="email"
          />
        </div>
        <div className="flex flex-col py-2">
          <label className="py-2 font-medium">Password:</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3"
            type="password"
          />
        </div>
        <button className="border border-blue-500 bg-blue-600 hover:bg-blue-500 w-full p-4 my-2 text-white">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
