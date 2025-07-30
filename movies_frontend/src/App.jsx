import React from 'react'
import Search from './components/Search.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import Spinner from "./components/Spinner.jsx"
import MovieCard from "./components/MovieCard.jsx"

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMovies = async () => {
        setIsLoading(true);
        try {
            const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);
            
            if (!response.ok) {
                throw new Error("Failed to fetch movies");
            }

            const data = await response.json();

            if (data.response === 'False') {
                setErrorMsg(data.Error || 'Failed to fetch movies');
            }

            setMovieList(data.results || []);
            console.log(data.results)
            // throw new Exception("failed to get movies");
        } catch(error) {
            console.error(`Error fetching movies: ${error}`);  
            setErrorMsg("An error Occured. Please try again later.");         
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        fetchMovies();
    }, [])

    return (
        <main>
            <div className="pattern"/>

            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Movie Banner"/>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Love!</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>  
                </header>

                <section className='all-movies'>
                    <h2 className="mt-10">All Movies</h2>
                    {isLoading ? (
                        <Spinner/>
                    ):errorMsg ? (
                        <p className="text-red-500">{errorMsg}</p>
                    ): (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie}/>
                            ))}
                        </ul>
                    )}

                    {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                </section>
                <h1>{searchTerm}</h1>

            </div>
            
        </main>
    )
}

export default App