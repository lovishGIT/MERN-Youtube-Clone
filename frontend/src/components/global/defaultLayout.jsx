import React from 'react';
import Sidebar from './sidebar';
import Navbar from './navbar';

export default function DefaultLayout({children}) {
    return (
        <div className="w-[100%] bg-black text-white">
            <Navbar className="bg-black text-white fixed z-[100] px-6 w-full h-[10vh] flex justify-between items-center border-b-2 border-solid border-white" />
            <div className="w-full flex">
                <Sidebar className="hidden md:block fixed md:w-[20%] lg:w-[15%] h-full bg-black text-white border-r-2 border-solid border-white" />
                {children}
                {/* TODO:- Mobile Sidebar */}
            </div>
        </div>
    );
}
