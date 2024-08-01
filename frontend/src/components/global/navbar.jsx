import React, { useState } from 'react'
import SpecialButton from './specialButton';
// @ts-ignore
import LogoImg from '../../assets/logo.svg';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ className }) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery || searchQuery.trim() === '') {
            navigate('/');
        }
        navigate(`/search?query=${searchQuery}`);
    }
    return (
        <>
            <div className={className}>
                <div className="w-[10%]">
                    <img
                        src={LogoImg}
                        className="min-h-10 max-h-14 hover:animate-pulse"
                        alt=""
                    />
                </div>
                <div className="w-[50%] flex gap-[20px] items-center">
                    <FaSearch size="30" />
                    <form onSubmit={handleSearch} className="w-full">
                        <input
                            type='text'
                            className="h-[5vh] px-4 w-[70%] bg-black text-white border-2"
                            placeholder="Let's Watch"
                            value={searchQuery}
                            onChange={(e)=> setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>
                <div className="w-[10%] flex items-center gap-[5%] whitespace-nowrap">
                    <span className="text-2xl cursor-pointer">:</span>
                    {/* TODO:- Make a DROPDOWN on HOVER */}
                    <button className="p-2 border-2 border-black rounded-md hover:border-gray-600">
                        Log in
                    </button>
                    <SpecialButton>Sign up</SpecialButton>
                </div>
            </div>
            <div className={className} style={{ position: 'static'}}></div>
        </>
    );
}