import './index.css';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MyRecipes from './components/MyRecipes/MyRecipes';
import ExploreRecipes from './components/ExploreRecipes/ExploreRecipes';
import FavouriteRecipes from './components/MyFavourites/MyFavourites';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-tl-inactive-brown min-h-screen min-w-full">
        <div className='fixed w-full min-h-screen -z-10 bg-tl-inactive-brown'></div>
        <div className='fixed w-full z-[1000]'>
          <ToastContainer
            position='top-center'
            autoClose={3000}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick
            closeButton={<></>}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
        <Routes>
          <Route path="/" element={<ExploreRecipes/>} />
          <Route path="/my_recipes" element={<MyRecipes />} />
          <Route path="/my_favourites" element={<FavouriteRecipes />} />
        </Routes>
      </div>
    </BrowserRouter>
      
  );
}

export default App;
