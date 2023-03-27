import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserAuth } from "../context/AuthContext";

import axios from "axios";

const EnterData = () => {
  const [age, setAge] = useState(null);
  const [height, setHeight] = useState(null);
  const [income, setIncome] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { isAuthenticated, logoutUser } = UserAuth();

  const handleStoreData = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { idToken } = await isAuthenticated();

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
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteData = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { idToken } = await isAuthenticated();
      const result = await axios.delete(process.env.REACT_APP_API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
      });
      console.log(result);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGetData = async () => {
    setError("");

    try {
      const { idToken, accessToken } = await isAuthenticated();

      const urlParam = "/single";
      const queryParam = "?accessToken=" + accessToken;

      const result = await axios.get(
        process.env.REACT_APP_API_URL + urlParam + queryParam,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: idToken,
          },
        }
      );

      if (result.data.length === 0) {
        throw new Error(
          "An error occurred, please try again or submit new data!"
        );
      }

      setData(result.data);
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    }
  };

  const handleLogout = async () => {
    setError("");
    try {
      await logoutUser();
      navigate("/");
      console.log("You are logged out");
    } catch (err) {
      setError(err.message);
      console.log(err.message);
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

      <button onClick={handleLogout} className="border w-full px-6 py-2 my-4">
        Logout
      </button>

      <h1 className="text-2xl font-bold py-2">Set your Data</h1>
      <form onSubmit={handleStoreData}>
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

      <button
        onClick={handleDeleteData}
        className="border w-full px-6 py-2 my-4"
      >
        Delete Data
      </button>

      <button onClick={handleGetData} className="border w-full px-6 py-2 my-4">
        I've already stored data on the server!
      </button>

      {data && (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data[0]).map((key) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {key}
                  </th>
                  <td className="px-6 py-4">{data[0][key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EnterData;
