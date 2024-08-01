import React from 'react';
import { getTimeDiffString } from '../../utils/dateFinder';

export default function VidCard({ vid, index }) {
    const timeDiff = getTimeDiffString(vid.createdAt);
    return (
        <div
            className="m-2 w-[300px] h-[300px] border-2 border-solid border-white rounded-lg transition-all hover:scale-105"
            key={index}
        >
            <img
                className="w-[100%] h-[60%]"
                src={vid.thumbnail}
                alt="video Image"
            />
            <div className="p-4 pb-0 flex gap-[5%]">
                <div>
                    <img
                        className="w-[50px] h-[50px] rounded-full"
                        src={vid?.userAvatar}
                        alt=""
                    />
                </div>
                <div>
                    <h2 className="text-lg">{vid.title}</h2>
                    <div className="flex items-center text-gray-400">
                        <p>{vid.views} Views</p>
                        <span className="text-lg font-extrabold px-2">·</span>
                        <p>{timeDiff}</p>
                    </div>
                    <div className='text-gray-400'>{vid.userName}</div>
                </div>
            </div>
        </div>
    );
}
