import NavBar from './components/NavBar';
import './index.css';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

function App() {
  return (
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
      <NavBar/>
    </div>
  );
}

export default App;
