import React from 'react'
import Search from './components/Search.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import Spinner from "./components/Spinner.jsx"
import MovieCard from "./components/MovieCard.jsx"
import { useDebounce } from 'react-use'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const idToGenre = [
    {id: 28, name: 'Action'},
    {id: 12, name: 'Adventure'},
    {id: 16, name: 'Animation'},
    {id: 35, name: 'Comedy'},
    {id: 80, name: 'Crime'},
    {id: 99, name: 'Documentary'},
    {id: 18, name: 'Drama'},
    {id: 10751, name: 'Family'},
    {id: 14, name: 'Fantasy'},
    {id: 36, name: 'History'},
    {id: 27, name: 'Horror'},
    {id: 10402, name: 'Music'},
    {id: 9648, name: 'Mystery'},
    {id: 10749, name: 'Romance'},
    {id: 878, name: 'Sci-Fi'},
    {id: 10770, name: 'TV Movie'},
    {id: 53, name: 'Thriller'},
    {id: 10752, name: 'War'},
    {id: 37, name: 'Western'},
]

const genreMap = new Map()
idToGenre.forEach((genre) => {
    genreMap.set(genre.id,genre.name)
})


const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useDebounce(()=>setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        try {
            const endpoint = query
            ?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error("Failed to fetch movies");
            }

            const data = await response.json();

            if (data.response === 'False') {
                setErrorMsg(data.Error || 'Failed to fetch movies');
            }
            console.log('test2')

            setMovieList(data.results || []);
            console.log(data)
            // throw new Exception("failed to get movies");
        } catch(error) {
            console.error(`Error fetching movies: ${error}`);
            setErrorMsg("An error Occured. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    const fetchGenre = async () => {
        try {
            const endpoint = `${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}`
            const response = await fetch(endpoint, API_OPTIONS)

            if (!response.ok) {
                throw new Error('Failed to get genres')
            }

            const data = await response.json()
            console.log(data)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm])

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
                                <MovieCard key={movie.id} movie={movie} genreMap={genreMap}/>
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