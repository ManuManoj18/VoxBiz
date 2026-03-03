import React, { useState } from "react";
import Loader from "./ui/Loader";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import { SiPostgresql, } from 'react-icons/si';
import { GrMysql } from 'react-icons/gr';
const ConnectDatabaseModal = ({ onClose }) => {
  const [step, setStep] = useState("info");
  const [connectionMethod, setConnectionMethod] = useState("connectionString");
  const [formData, setFormData] = useState({
    dbType: "PostgreSQL", // defaul
    dbName: "",
    connectionString: "",
    username: "",
    password: "",
    host: "localhost",
    port: "5432",
  });
  const [error, setError] = useState("");

  const dbTypeIconMap = {
    PostgreSQL: <SiPostgresql className="text-blue-600 text-5xl drop-shadow" />,
    MySQL: <GrMysql className="text-5xl mb-1 text-blue-600 drop-shadow" />

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConnectionMethodChange = (method) => {
    setConnectionMethod(method);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setStep("loading");

    let dataToSubmit = {
      databaseName: formData.dbName,
      connectionURI: formData.connectionString,
      type: formData.dbType.toLowerCase(), // postgres or mysql
    };

    // If using credentials method, build connection string
    if (connectionMethod === "credentials") {
      if (formData.dbType === "PostgreSQL") {
        dataToSubmit.connectionURI = `postgresql://${formData.username}:${formData.password}@${formData.host}:${formData.port}/${formData.dbName}`;
      } else if (formData.dbType === "MySQL") {
        dataToSubmit.connectionURI = `mysql://${formData.username}:${formData.password}@${formData.host}:${formData.port}/${formData.dbName}`;
      }
    }

    try {
  const response = await axios.post(`${API_BASE_URL}/api/database/connect`, dataToSubmit, {
        withCredentials: true
      });

      if (response.status === 201) {
        setStep("success");
      } else {
        setError(response.data.error || "Failed to connect to database.");
        setStep("error");
      }
    } catch (error) {
      console.error("Error connecting to database:", error);
      setError(
        error.response?.data?.error || "Failed to connect to database. Please check your credentials."
      );
      setStep("error");
    }
  };
  const isFormValid = () => {
    if (!formData.dbName) return false;

    if (connectionMethod === "connectionString") {
      return !!formData.connectionString;
    } else {
      return !!formData.username && !!formData.password && !!formData.host;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md mx-2 md:mx-auto p-6 rounded-lg shadow-xl bg-gray-800 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-4">Connect to Database</h2>

        {step === "info" && (
          <div>
            <div className="mb-6 p-4 rounded-lg bg-blue-900 text-blue-100">
              <h3 className="font-bold mb-2">Important Information</h3>
              <p className="mb-2">Please ensure you have the following information ready:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Database name (required)</li>
                <li>PostgreSQL connection string OR</li>
                <li>Database credentials (username, password, host)</li>
              </ul>
              <p className="mt-2 text-sm">
                To obtain these from PostgreSQL:
              </p>
              <ol className="list-decimal list-inside mt-1 ml-4 text-sm">
                <li>Login to your PostgreSQL admin panel</li>
                <li>Locate your existing database</li>
                <li>Get the connection credentials</li>
              </ol>
            </div>
            <button
              onClick={() => setStep("form")}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue
            </button>
          </div>
        )}

        {step === "form" && (
          <form onSubmit={submitForm}>
            <div className="space-y-4 mb-6">
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Database Type <span className="text-red-500">*</span>
                  </label>

                  <div className="flex gap-4">
                    {["PostgreSQL", "MySQL"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, dbType: type }))}
                        className={`
          flex flex-col items-center justify-center px-4 py-3 rounded-md border w-32 transition-all
          ${formData.dbType === type
                            ? 'bg-blue-700 border-blue-500 text-white'
                            : 'bg-gray-700 border-gray-500 text-white'}
        `}
                      >
                        {type === "PostgreSQL" ? (
                          <SiPostgresql className="text-2xl mb-1" />
                        ) : (
                          <GrMysql className="text-2xl mb-1 text-blue-600" />
                        )}
                        <span className="text-sm">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <label className="block text-sm font-medium mb-1">Database Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="dbName"
                  value={formData.dbName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border-gray-600 border"
                />
              </div>

              <div className="flex items-center space-x-4 border-b pb-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="connectionMethod"
                    checked={connectionMethod === "connectionString"}
                    onChange={() => handleConnectionMethodChange("connectionString")}
                    className="mr-2"
                  />
                  <span>Connection String</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="connectionMethod"
                    checked={connectionMethod === "credentials"}
                    onChange={() => handleConnectionMethodChange("credentials")}
                    className="mr-2"
                  />
                  <span>Credentials</span>
                </label>
              </div>

              {connectionMethod === "connectionString" ? (
                <div>
                  <label className="block text-sm font-medium mb-1">Connection String <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="connectionString"
                    value={formData.connectionString}
                    onChange={handleInputChange}
                    required={connectionMethod === "connectionString"}
                    placeholder="postgresql://username:password@host:port/database"
                    className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border-gray-600 border"
                  />

                </div>

              )
                : (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Username <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required={connectionMethod === "credentials"}
                        className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border-gray-600 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Password <span className="text-red-500">*</span></label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={connectionMethod === "credentials"}
                        className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border-gray-600 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Host <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="host"
                        value={formData.host}
                        onChange={handleInputChange}
                        required={connectionMethod === "credentials"}
                        placeholder="localhost"
                        className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border-gray-600 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Port</label>
                      <input
                        type="text"
                        name="port"
                        value={formData.port}
                        onChange={handleInputChange}
                        placeholder="5432"
                        className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border-gray-600 border"
                      />
                    </div>
                  </>
                )}
            </div>
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-2 rounded-lg ${isFormValid()
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
                } text-white`}
            >
              {`Connect to ${formData.dbType} Database`}
            </button>
          </form>
        )}

        {step === "loading" && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size="large" />
            <p className="mt-4">Connecting to database...</p>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-xl font-bold mb-2">Connection Successful!</h3>
            <p className="mb-4">Your database has been connected successfully.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Close
            </button>
          </div>
        )}

        {step === "error" && (
          <div className="text-center py-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h3 className="text-xl font-bold mb-2">Connection Failed</h3>
            <p className="mb-4 text-red-500">{error}</p>
            <button
              onClick={() => setStep("form")}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectDatabaseModal;