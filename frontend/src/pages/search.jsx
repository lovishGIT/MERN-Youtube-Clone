import React, { useEffect, useState } from 'react';
// @ts-ignore
import LogoImg from '../assets/logo.svg';
import { Link, useSearchParams } from 'react-router-dom';
import VidSCard from '../components/search/vidSCard';

export default function Search() {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('query');
    const [allVids, setAllVids] = useState([]);
    useEffect(() => {
        try {
            (async function () {
                let res = await fetch(
                    `http://localhost:8000/api/v1/video/random?query=${searchQuery}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/json',
                        },
                    }
                );
                let videos = await res.json();
                setAllVids(videos.data);
                console.log(allVids?.length);
            })();
        } catch (error) {
            console.error("Unable to fetch Videos.");
        }
    }, [searchQuery])
    return (
        <div className="pr-2 py-8 w-full min-h-[90vh] md:w-[80%] lg:w-[85%] bg-black text-white border-0">
            {allVids?.length > 0 ? (
                allVids?.map((vid, index) => (
                    <>
                        <VidSCard vid={vid} index={index} />
                        <VidSCard vid={vid} index={index} />
                        <VidSCard vid={vid} index={index} />
                    </>
                ))
            ) : (
                <div className="w-full h-full bg-black text-white flex flex-col gap-[2vh] justify-center items-center">
                    <Link to="/">
                        <img
                            className="w-[75px] h-[75px] animate-pulse"
                            src={LogoImg}
                            alt=""
                        />
                    </Link>
                    <p>
                        No search results available for your
                        Search&#65282;{searchQuery}&#65282;
                    </p>
                </div>
            )}
        </div>
    );
}
