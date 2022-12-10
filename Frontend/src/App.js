import './App.css';
import React from 'react';
import HomePage from './Home/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ContactPage from './Home/Contact';

function App(){
              return(
                <div className='App'>
                  <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/contact" element={<ContactPage/>} />
                  </Routes>
                  </BrowserRouter>
        
               </div>
                     );

      }
export default App; 