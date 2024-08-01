import React from 'react'
import { FaHome } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { BsClockHistory } from "react-icons/bs";
import { CiSignpostDuo1 } from "react-icons/ci";
import { IoIosVideocam } from "react-icons/io";
import { RxDashboard } from "react-icons/rx";
import { FaRegCircleQuestion } from 'react-icons/fa6';
import { IoMdSettings } from 'react-icons/io';
import { Link } from 'react-router-dom';

const NavPages = [
    {
        icon: <FaHome />,
        text: 'Home',
        link: '/',
    },
    {
        icon: <AiOutlineLike />,
        text: 'Liked Videos',
        link: '/likedVids',
    },
    {
        icon: <BsClockHistory />,
        text: 'History',
        link: '/history',
    },
    {
        icon: <CiSignpostDuo1 />,
        text: 'My Tweets',
        link: '/myTweets',
    },
    {
        icon: <IoIosVideocam />,
        text: 'My Content',
        link: '/myContent',
    },
    {
        icon: <RxDashboard />,
        text: 'My Dashboard',
        link: '/dashboard',
    },
];

const AccountPages = [
    {
        icon: <FaRegCircleQuestion />,
        text: 'Support',
        link: '/support',
    },
    {
        icon: <IoMdSettings />,
        text: 'Settings',
        link: '/settings',
    },
];

export default function Sidebar({className}) {
    return (
        <>
            <div
                className={`${className} flex flex-col justify-between`}
            >
                <div className="py-10 px-4 w-full flex flex-col space-y-2 justify-center">
                    {NavPages.map((page, index) => (
                        <Link to={page.link}
                            key={index}
                            className="p-2 flex items-center gap-2 border-2 hover:text-black hover:bg-white"
                        >
                            <div className="scale-125">
                                {page.icon}
                            </div>
                            <div className="text-lg">{page.text}</div>
                        </Link>
                    ))}
                </div>
                <div className="py-10 px-4 w-full flex flex-col space-y-2 justify-center">
                    {AccountPages.map((page, index) => (
                        <Link to={page.link}
                            key={index}
                            className="p-2 flex items-center gap-2 border-2 hover:text-black hover:bg-white"
                        >
                            <div className="scale-125">
                                {page.icon}
                            </div>
                            <div className="text-lg">{page.text}</div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className={className} style={{ position: 'static', border: 0 }}></div>
        </>
    );
};
