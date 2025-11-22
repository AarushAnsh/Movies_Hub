import React, { useEffect, useState } from 'react'
import { CircularProgress, Box } from '@mui/material';
import SingleContent from '../../Components/SingleContent/SingleContent';
import './Trending.css';
import CustomPagination from '../../Components/Pagination/CustomPagination';

const Trending = () => {

  const[content,setContent]=useState([]);
  const[page,setPage]=useState(1);
  const[loading,setLoading]=useState(true);
  const API_KEY = "dc5e54f47e1adf658c0fca36e5332e8e";
  
   async function fetchTrending() {
     setLoading(true);
     try {
       const url= `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&page=${page}`;
       const response = await fetch(url);
       const data = await response.json();
       
       // Filter only movies and TV shows right after fetch
       const filtered = (data.results || []).filter((c) => c.media_type === "movie" || c.media_type === "tv");
       setContent(filtered);
     } catch (error) {
       console.error("Error fetching trending:", error);
       setContent([]);
     } finally {
       setLoading(false);
     }
   }

   useEffect(()=>{
    fetchTrending()
   },[page])
  
  return (
    <div>
     <div className="pageHero">
       <p className='pageTitle'> Trending</p>
       <p className="pageSubtitle">What everyone's watching right now.</p>
     </div>
     {loading ? (
       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
         <CircularProgress sx={{ color: '#ff5f6d' }} />
       </Box>
     ) : (
       <>
         <div className="trending">
          {content && content.map((c)=>( 
             <SingleContent 
               key={c.id} 
               id={c.id} 
               poster={c.poster_path}  
               title={c.title || c.name} 
               date={c.first_air_date || c.release_date} 
               media_type={c.media_type}
               vote_average={c.vote_average}
             />
          ))}
         </div>
         <CustomPagination page={page} setPage={setPage} />
       </>
     )}
    </div>
  )
}

export default Trending
