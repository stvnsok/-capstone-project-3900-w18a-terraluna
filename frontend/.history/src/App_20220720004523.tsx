import NavBar from './components/NavBar';
import './index.css';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MyRecipes from './components/MyRecipes/MyRecipes';
import CreateRecipeCard from './components/NewRecipe/CreateRecipeCard';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-tl-inactive-white min-h-screen min-w-full">
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
          <Route path="/" element={<NavBar/>} />
          <Route path="/my_recipes" element={<MyRecipes />} />
          {/* path is for testing purposes, remove once added to slide out window*/}
          <Route path ="/new_recipe" element={<CreateRecipeCard/>} />
        </Routes>
      </div>
    </BrowserRouter>
      
  );
}

export default App;
