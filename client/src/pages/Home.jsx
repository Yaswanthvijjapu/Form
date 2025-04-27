import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function Home() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/editor');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="h-screen pt-16 bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full text-center space-y-6">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          Build Beautiful Forms Effortlessly
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Create, customize, and manage forms with ease. Collect responses, streamline workflows, and grow your business—all in one place.
        </p>

        {/* Get Started Button */}
        <div>
          <button
            onClick={handleGetStarted}
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-full shadow-md transition duration-300"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
