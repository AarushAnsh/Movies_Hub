import React, { useState } from 'react'
import { useEffect } from 'react';
import "./Movie.css"
import { useBlocker } from 'react-router-dom';
import SingleContent from '../../Components/SingleContent/SingleContent';
import CustomPagination from '../../Components/Pagination/CustomPagination';
import Genres from '../../Components/Genres/Genres';
import useGenres from '../../Hooks/UseGenre';


const Movie = () => {

  const[page,setPage]=useState(1);
  const[content,setContent]=useState([]);
  const[numOfPages,setNumOfPages]=useState();
  const [selectedGenres,setSelectedGenres]=useState([]);
  const[genres,setGenres]=useState([]);
  const genreURL =useGenres(selectedGenres)

  

  const API_KEY = "dc5e54f47e1adf658c0fca36e5332e8e";

 async function fetchMovie() {
     const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&with_genres=${genreURL}`;

      const response = await fetch(url);
      const data = await response.json();
      setContent(data.results);

      const totalPages = Math.min(data.total_pages || 1, 500);
      setNumOfPages(totalPages);

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
 
    useEffect(()=>{
     fetchMovie()
    },[page,genreURL])
   
  return (
    <div>
        <div className='pageHero pageHero--left'>
          <p className='pageTitle'> Movies</p>
        </div>
        <Genres
          type='movie' selectedGenres={selectedGenres}  setSelectedGenres={setSelectedGenres} genres={genres} setGenres={setGenres} setPage={setPage}
        />
       <div className="trending">
       {
        content && content.map((c)=>(
          
           <SingleContent key={c.id} id={c.id} poster={c.poster_path}  title={c.title || c.name} date={c.first_air_date || c.release_date} 
           media_type = "movie"
           vote_average={c.vote_average}/>

        ))
       }
     </div>
      {
        numOfPages >1 &&
        <CustomPagination page={page} setPage={setPage} numOfPages={numOfPages} />
      }
    </div>
  )
}

export default Movie
