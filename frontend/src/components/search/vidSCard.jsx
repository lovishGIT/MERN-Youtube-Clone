import React from 'react';
import { getTimeDiffString } from '../../utils/dateFinder';

export default function VidSCard({ vid, index }) {
    const timeDiff = getTimeDiffString(vid.createdAt);
    return (
        <div
            className="m-2 w-full h-[300px] flex border-[1px]"
            key={index}
        >
            <div className='w-[60%] h-full'>
                <img
                    className="w-full h-full"
                    src={vid.thumbnail}
                    alt="video Image"
                />
            </div>
            <div className="w-full p-4 pb-0 flex gap-[5%]">
                <div className="py-2">
                    <img
                        className="w-[50px] h-[50px] rounded-full"
                        src={vid?.userAvatar}
                        alt=""
                    />
                </div>
                <div className="py-2 h-[100%]">
                    <div>
                        <h2 className="text-lg">{vid.title}</h2>
                        <div className="text-gray-400">
                            {vid.userName}
                        </div>
                        <p className="text-gray-400">
                            {vid.description}
                        </p>
                        <div className="flex items-center text-gray-400">
                            <p>{vid.views} Views</p>
                            <span className="text-lg font-extrabold px-2">
                                ·
                            </span>
                            <p>{timeDiff}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
