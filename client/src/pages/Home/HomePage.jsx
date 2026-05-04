import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FoodRecueTitle from "../../components/FoodRecueTitle";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const foodCategories = [
    "Salads",
    "Donuts",
    "Bread",
    "Burritos",
    "Pizza",
    "Chicken",
    "Grocery",
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <a
                href="/"
                className="text-xl font-bold text-green-800 hover:text-green-600 transition"
              >
                Home
              </a>
              <a
                onClick={() => navigate("/about-us")}
                className="text-xl font-bold text-green-800 hover:text-green-600 transition hidden sm:block cursor-pointer"
              >
                About us
              </a>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-2">
                <div className="w-16 h-16 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">FR</span>
                </div>
                <span>
                  <FoodRecueTitle />
                </span>
              </div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-emerald-500 rounded-full font-bold hover:bg-emerald-600 transition text-white cursor-pointer"
              >
                Login
              </button>
              {/* <button className="px-6 py-2 bg-emerald-500 rounded-full font-bold hover:bg-emerald-600 transition">
                Business Signup
              </button> */}
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-green-50 via-emerald-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight  bg-linear-to-r from-green-700 via-emerald-600 to-green-700 bg-clip-text text-transparent">
            Save good food from going to waste
          </h1>
          <button
            onClick={() => navigate("/business-signup")}
            className="px-8 py-3 bg-green-600 text-white rounded-full text-xl font-bold hover:bg-green-700 transition transform hover:scale-105 shadow-lg cursor-pointer"
          >
            Business Signup
          </button>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-bold text-center  text-green-700">
            Why use
          </h2>
          <div className="w-full  py-5 px-4">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-center tracking-tight">
              <span className="inline-block transform -rotate-2 bg-linear-to-br from-green-400 via-green-300 to-green-400 text-transparent bg-clip-text drop-shadow-lg">
                Food
              </span>{" "}
              <span className="inline-block transform rotate-1 bg-linear-to-br from-green-400 via-green-300 to-green-400 text-transparent bg-clip-text drop-shadow-lg">
                Rescue
              </span>
            </h1>

            <style jsx>{`
              h1 span {
                font-family: "Arial Black", "Arial Bold", sans-serif;
                font-weight: 900;
                letter-spacing: 0.02em;
                text-shadow: 2px 2px 4px rgba(244, 114, 182, 0.3);
              }
            `}</style>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Benefit 1 */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-green-800 mb-3">
                Save Money
              </h3>
              <p className="text-gray-700 text-lg">
                Enjoy great food at half the price or less
              </p>
            </div>

            <div className="bg-linear-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold text-green-800 mb-3">
                Help Environment
              </h3>
              <p className="text-gray-700 text-lg">
                Help the environment by reducing food waste
              </p>
            </div>

            <div className="bg-linear-to-br from-teal-50 to-cyan-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-green-800 mb-3">
                Last-Minute Deals
              </h3>
              <p className="text-gray-700 text-lg">
                Grab delicious last-minute deals before they're gone
              </p>
            </div>

            <div className="bg-linear-to-br from-cyan-50 to-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="text-5xl mb-4">🏪</div>
              <h3 className="text-2xl font-bold text-green-800 mb-3">
                Support Local
              </h3>
              <p className="text-gray-700 text-lg">
                Support local businesses while saving money
              </p>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-2xl font-bold text-green-800 mb-3">
                Near You
              </h3>
              <p className="text-gray-700 text-lg">
                Rescue surplus food available near you
              </p>
            </div>

            <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="text-2xl font-bold text-green-800 mb-3">
                Quality Food
              </h3>
              <p className="text-gray-700 text-lg">
                Get perfectly good food that would otherwise go to waste
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-linear-to-r from-green-200 via-emerald-100 to-teal-100 py-6 overflow-hidden border-y-4 border-orange-200">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...foodCategories, ...foodCategories, ...foodCategories].map(
            (category, index) => (
              <span key={index} className="text-4xl sm:text-5xl font-bold mx-8">
                {category}
              </span>
            )
          )}
        </div>
      </div>

      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight text-green-800">
            Join Over 10,000 Bussinesses Fighting
            <br />
            Food Waste With Us
          </h2>
          <button
            onClick={() => navigate("/business-signup")}
            className="px-8 py-3 bg-green-600 text-white rounded-full text-xl font-bold hover:bg-green-700 transition transform hover:scale-105 shadow-lg cursor-pointer"
          >
            Business Signup
          </button>
        </div>
      </section>

      <footer className="bg-linear-to-b from-green-100 to-emerald-200 py-12 px-4 sm:px-6 lg:px-8 rounded-t-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-8 sm:space-y-0">
            {/* Footer Logo */}
            <div className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">FR</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <a href="#" className="text-lg hover:text-gray-600">
                Privacy policy
              </a>
              <a href="#" className="text-lg hover:text-gray-600">
                Terms & Conditions
              </a>
              <a href="#" className="text-lg hover:text-gray-600">
                Contact us
              </a>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-green-700">
              © Food Recue Platform, 2025 - All rights reserved
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
