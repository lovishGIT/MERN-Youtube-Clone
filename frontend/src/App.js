import React from 'react';

import Home from './pages/home';
import Search from './pages/search';
import DefaultLayout from './components/global/defaultLayout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
    return (
        <BrowserRouter>
            <DefaultLayout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/search"
                        element={<Search />}
                    />
                </Routes>
            </DefaultLayout>
        </BrowserRouter>
    );
}
