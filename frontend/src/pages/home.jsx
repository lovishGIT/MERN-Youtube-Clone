import React, { useEffect, useState } from 'react';
import VidCard from '../components/home/vidCard';

export default function Home() {
    const [videos, getAllVideos] = useState([]);
    useEffect(() => {
        // getting videos
        (async function () {
            try {
                let response = await fetch(
                    `http://localhost:8000/api/v1/video/random`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                let allvids = await response.json();
                getAllVideos(allvids.data);
            } catch (error) {
                console.error("Server Error: ", error);
            }
        })();
    }, []);
    return (
        <div className="px-4 py-4 w-full min-h-[90vh] md:w-[80%] lg:w-[85%] bg-black text-white grid grid-cols-1 place-items-center sm:place-items-start sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-0">
            {videos.map((vid, index) => (
                <VidCard vid={vid} index={index} />
            ))}
            {videos.map((vid, index) => (
                <VidCard vid={vid} index={index} />
            ))}
        </div>
    );
}
