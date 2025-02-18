// import React, { useContext, useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { motion } from 'framer-motion';

// const testimonials = [
//   { id: 1, text: "I've made consistent profits using this method!", name: "Alex T." },
//   { id: 2, text: "This trading strategy changed my life!", name: "Jordan P." },
//   { id: 3, text: "A game-changer for anyone serious about trading.", name: "Sam W." }
// ];

// const MainPage = () => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [currentTestimonial, setCurrentTestimonial] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <div className="bg-black min-h-screen text-white font-sans overflow-hidden">
//       {/* Hero Section */}
//       <motion.div 
//         initial={{ opacity: 0, y: -50 }} 
//         animate={{ opacity: 1, y: 0 }} 
//         transition={{ duration: 1 }}
//         className="flex flex-col items-center justify-center text-center pt-20"
//       >
//         <h1 className="text-5xl font-bold mb-6 tracking-wide">
//           Welcome to <span className="text-green-400">&thejuice</span>
//         </h1>
//         <p className="text-lg mb-12 max-w-3xl">
//           Your gateway to mastering trading strategies, risk management, and market trends.
//         </p>
//       </motion.div>

//       {/* Buttons */}
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 1, delay: 0.5 }}
//         className="flex flex-col items-center space-y-4"
//       >
//         {user ? (
//           <>
//             <p className="text-xl">Hello, {user.firstName}!</p>
//             <Link to="/profile">
//               <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition duration-300">
//                 Go to My Profile
//               </button>
//             </Link>
//             <Link to="/my-classes">
//               <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition duration-300">
//                 My Classes
//               </button>
//             </Link>
//             {user.role === 'admin' && (
//               <Link to="/manage-classes">
//                 <button className="px-8 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-700 transition duration-300">
//                   Manage Classes
//                 </button>
//               </Link>
//             )}
//             <button onClick={handleLogout} className="px-8 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-700 transition duration-300">
//               Log Out
//             </button>
//           </>
//         ) : (
//           <div className="flex gap-6">
//             <Link to="/login">
//               <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition duration-300">
//                 Login
//               </button>
//             </Link>
//             <Link to="/register">
//               <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition duration-300">
//                 Register
//               </button>
//             </Link>
//           </div>
//         )}
//       </motion.div>

//       {/* Testimonials Auto-Scrolling */}
//       <div className="mt-16 flex justify-center">
//         <motion.div
//           key={testimonials[currentTestimonial].id}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.5 }}
//           className="text-center bg-gray-900 p-6 rounded-lg shadow-lg w-2/3"
//         >
//           <p className="text-lg italic">"{testimonials[currentTestimonial].text}"</p>
//           <p className="text-green-400 font-semibold mt-3">- {testimonials[currentTestimonial].name}</p>
//         </motion.div>
//       </div>

//       {/* Footer */}
//       <footer className="absolute bottom-6 text-sm text-gray-500 w-full text-center">
//         &copy; {new Date().getFullYear()} &thejuice. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default MainPage;
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const testimonials = [
  { id: 1, text: "I've made consistent profits using this method!", name: "Alex T." },
  { id: 2, text: "This trading strategy changed my life!", name: "Jordan P." },
  { id: 3, text: "A game-changer for anyone serious about trading.", name: "Sam W." }
];

const MainPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans">
      {/* Hero Section with Trading Chart Background */}
<div 
  className="relative w-full h-screen flex flex-col items-center justify-center text-center p-8 bg-cover bg-center"
  style={{ backgroundImage: "url('/images/black-white-market-chart.jpg')" }} // Replace with your actual image path
>
  {/* Dark overlay to make text stand out */}
  <div className="absolute w-full h-full bg-black opacity-60"></div>

  <motion.div 
    initial={{ opacity: 0, y: -50 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 1 }}
    className="relative z-10 text-center"
  >
    <h1 className="text-6xl font-bold mb-6 tracking-wide text-white">
      MASTER TRADING & WIN CONSISTENTLY
    </h1>
    <p className="text-lg max-w-3xl mx-auto text-gray-300">
      Learn the strategies used by top traders to make consistent profits. 
      Build your financial future with confidence.
    </p>
    <Link to="/register">
      <motion.button 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-300 transition duration-300"
      >
        Get Started
      </motion.button>
    </Link>
  </motion.div>
</div>


      {/* Program Overview Section */}
      <div className="py-16 bg-gray-900 text-center">
        <h2 className="text-4xl font-semibold mb-8 text-white">Why Choose Our Strategy?</h2>
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/3 p-6">
            <img src="/images/trading-strategy.png" alt="Trading Strategy" className="mx-auto mb-4 w-20" />
            <h3 className="text-xl font-bold text-white mb-2">Proven Strategies</h3>
            <p className="text-gray-400">Our system is designed for maximum efficiency and consistent profits.</p>
          </div>
          <div className="w-full md:w-1/3 p-6">
            <img src="/images/community.png" alt="Community" className="mx-auto mb-4 w-20" />
            <h3 className="text-xl font-bold text-white mb-2">Exclusive Community</h3>
            <p className="text-gray-400">Connect with traders, share insights, and grow together.</p>
          </div>
          <div className="w-full md:w-1/3 p-6">
            <img src="/images/live-training.png" alt="Live Training" className="mx-auto mb-4 w-20" />
            <h3 className="text-xl font-bold text-white mb-2">Live Training</h3>
            <p className="text-gray-400">Join weekly sessions with expert traders to refine your skills.</p>
          </div>
        </div>
      </div>

      {/* Trading Visualization Section */}
      <div className="py-20 flex flex-col items-center bg-black">
        <h2 className="text-4xl font-semibold text-white mb-6">See the Market Like a Pro</h2>
        <p className="text-gray-400 text-lg max-w-2xl text-center mb-8">
          Our visual tools help you understand market trends and make smarter trading decisions.
        </p>
        <img src="/images/market-chart-design.png" alt="Market Chart Design" className="w-3/4 md:w-1/2" />
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-gray-900 text-center">
        <h2 className="text-4xl font-semibold text-white mb-8">What Our Members Say</h2>
        <motion.div
          key={testimonials[currentTestimonial].id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center bg-black p-6 rounded-lg shadow-lg w-2/3 mx-auto"
        >
          <p className="text-lg italic text-gray-300">"{testimonials[currentTestimonial].text}"</p>
          <p className="text-white font-semibold mt-3">- {testimonials[currentTestimonial].name}</p>
        </motion.div>
      </div>

      {/* User Authentication Options */}
      <div className="flex flex-col items-center space-y-6 py-16 bg-black">
        {user ? (
          <>
            <p className="text-xl text-white">Hello, {user.firstName}!</p>
            <Link to="/profile">
              <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-300 transition duration-300">
                Go to My Profile
              </button>
            </Link>
            <button 
              onClick={handleLogout} 
              className="px-8 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-700 transition duration-300"
            >
              Log Out
            </button>
          </>
        ) : (
          <div className="flex gap-6">
            <Link to="/login">
              <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-300 transition duration-300">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition duration-300">
                Register
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-500 w-full text-center py-6 bg-black">
        &copy; {new Date().getFullYear()} &thejuice. All rights reserved.
      </footer>
    </div>
  );
};

export default MainPage;
