import React from 'react'
import { Link } from 'react-router-dom'


const Home = () => {
  return (
    <>
    <div className="flex  items-center justify-center min-h-screen bg-gray-100 gap-5">
      {/* Grid Container with hover effect */}
      <div className="w-80 p-10 bg-white rounded-lg border-2 border-orange700 shadow-lg text-center transform transition-transform duration-300 hover:scale-105">
        {/* Logo */}
        <img src="/2048_logo.png" alt="2048 Logo" className="mx-auto mb-6 w-24 h-24" />

        {/* Title */}
        <h1 className="text-xl font-bold text-orange700 mb-6">2048</h1>

        {/* Play Button */}
        <Link to="/2048" className="bg-orange700 hover:bg-orange-700 hover:text-white text-slate-700 py-2 px-6 rounded-md text-lg">
          Play
        </Link>
      </div>
      <div className="w-80 p-10 bg-white rounded-lg border-2 border-orange700 shadow-lg text-center transform transition-transform duration-300 hover:scale-105">
        {/* Logo */}
        <img src="/flappyb_logo.jpeg" alt="flappy Logo" className="mx-auto mb-6 w-24 h-24" />

        {/* Title */}
        <h1 className="text-xl font-bold text-orange700 mb-6">Flappy Bird</h1>

        {/* Play Button */}
        <button className="bg-orange700 hover:bg-orange-700 hover:text-white text-slate-700 py-2 px-6 rounded-md text-lg">
          Play
        </button>
      </div>
      <div className="w-80 p-10 bg-white rounded-lg border-2 border-orange700 shadow-lg text-center transform transition-transform duration-300 hover:scale-105">
        {/* Logo */}
        <img src="/coming_soon.png" alt="Coming Soon Logo" className="mx-auto mb-6 w-32 h-24" />

        {/* Title */}
        <h1 className="text-xl font-bold text-orange700 mb-6">Coming Soon...</h1>

        {/* Play Button */}
        <button className="bg-orange700 text-slate-700 py-2 px-6 rounded-md text-lg">
          Play
        </button>
      </div>
    </div>
    </>
  )
}

export default Home