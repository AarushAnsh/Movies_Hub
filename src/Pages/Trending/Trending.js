import { CleaningServices } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import SingleContent from '../../Components/SingleContent/SingleContent';
import './Trending.css';
import CustomPagination from '../../Components/Pagination/CustomPagination';

const Trending = () => {

  const[content,setContent]=useState([]);
  const[page,setPage]=useState(1);
  const API_KEY = "dc5e54f47e1adf658c0fca36e5332e8e";
  
   async function fetchTrending(params) {
     const url= `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&page=${page}`;
    
     const response = await fetch(url);
     const data = await response.json();
     console.log(data.results)
     setContent(data.results)
   }

   useEffect(()=>{
    fetchTrending()
   },[page])
  
  return (
    <div>
     <div className="pageHero">
       <p className='pageTitle'> Trending</p>
       <p className="pageSubtitle">What everyone’s watching right now.</p>
     </div>
     <div className="trending">
      {
        content &&
        content
        .filter((c)=> c.media_type === "movie" || c.media_type === "tv")
        .map((c)=>( 
          
           <SingleContent key={c.id} id={c.id} poster={c.poster_path}  title={c.title || c.name} date={c.first_air_date || c.release_date} 
           media_type ={c.media_type}
           vote_average={c.vote_average}/>

        ))
      }
     </div>
     <CustomPagination page={page} setPage={setPage} />
    </div>
  )
}

export default Trending
