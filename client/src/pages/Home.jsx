// client/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl">
          Welcome to Your Form Builder
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Create, customize, and manage forms with ease. Collect responses, export data, and streamline your workflows—all in one place. Start building your first form today!
        </p>
        <div className="mt-8">
          <Link
            to="/editor"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-200 text-lg font-medium"
          >
            Get Started
          </Link>
        </div>
        <div className="mt-10">
          <img
            src="https://via.placeholder.com/800x400.png?text=Form+Builder+Illustration"
            alt="Form Builder Illustration"
            className="mx-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;