import React from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter} from 'react-router-dom';
import {MotionConfig} from 'framer-motion';import {Toaster} from 'react-hot-toast';import App from './App';import './index.css';
createRoot(document.getElementById('root')).render(<BrowserRouter><MotionConfig reducedMotion="user"><App/><Toaster position="top-right"/></MotionConfig></BrowserRouter>);
