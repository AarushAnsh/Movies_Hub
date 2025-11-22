import React, { useEffect, useState } from 'react'
import { CircularProgress, Box, Typography, Button } from '@mui/material';
import SingleContent from '../../Components/SingleContent/SingleContent';
import './Trending.css';
import CustomPagination from '../../Components/Pagination/CustomPagination';
import { API_KEY, fetchOptions } from '../../config';

const Trending = () => {

  const[content,setContent]=useState([]);
  const[page,setPage]=useState(1);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState(null);
  
   async function fetchTrending() {
     setLoading(true);
     setError(null);
     try {
       // Ensure API_KEY is available
       if (!API_KEY) {
         throw new Error("API key is missing. Please configure your environment variables.");
       }
       
       const url= `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&page=${page}`;
       console.log('Fetching from URL:', url.replace(API_KEY, 'API_KEY_HIDDEN')); // Debug without exposing key
       
       // Add timeout for mobile networks
       const controller = new AbortController();
       const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
       
       // Simplified fetch for better mobile compatibility
       const response = await fetch(url, {
         method: 'GET',
         headers: {
           'Accept': 'application/json',
         },
         signal: controller.signal,
       });
       
       clearTimeout(timeoutId);
       
       if (!response.ok) {
         const errorText = await response.text();
         console.error('API Response Error:', response.status, errorText);
         throw new Error(`API Error: ${response.status} ${response.statusText}`);
       }
       
       const data = await response.json();
       console.log('API Response:', data); // Debug log
       
       if (!data || !data.results) {
         console.error('Invalid API response:', data);
         throw new Error("Invalid API response format");
       }
       
       // Filter only movies and TV shows right after fetch
       const filtered = data.results.filter((c) => c.media_type === "movie" || c.media_type === "tv");
       console.log('Filtered content count:', filtered.length); // Debug log
       
       if (filtered.length === 0) {
         throw new Error("No movies or TV shows found in trending results");
       }
       
       setContent(filtered);
     } catch (error) {
       console.error("Error fetching trending:", error);
       
       let errorMessage = "Failed to load trending content.";
       if (error.name === 'AbortError') {
         errorMessage = "Request timed out. Please check your internet connection and try again.";
       } else if (error.message) {
         errorMessage = error.message;
       } else {
         errorMessage = "Failed to load trending content. Please check your internet connection.";
       }
       
       setError(errorMessage);
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
     ) : error ? (
       <Box sx={{ 
         display: 'flex', 
         flexDirection: 'column',
         justifyContent: 'center', 
         alignItems: 'center', 
         minHeight: '400px',
         padding: '40px 20px',
         textAlign: 'center'
       }}>
         <Typography sx={{ color: '#ff5f6d', mb: 2, fontSize: '1.1rem', fontWeight: 600 }}>
           ⚠️ Error Loading Content
         </Typography>
         <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, fontSize: '0.9rem' }}>
           {error}
         </Typography>
         <Button 
           variant="contained" 
           onClick={fetchTrending}
           sx={{ 
             background: 'linear-gradient(120deg, #ff5f6d, #ffc371)',
             '&:hover': { background: 'linear-gradient(120deg, #ff4d5f, #ffb85c)' }
           }}
         >
           Retry
         </Button>
       </Box>
     ) : content.length === 0 ? (
       <Box sx={{ 
         display: 'flex', 
         justifyContent: 'center', 
         alignItems: 'center', 
         minHeight: '400px',
         color: 'rgba(255,255,255,0.7)'
       }}>
         <Typography>No trending content available at the moment.</Typography>
       </Box>
     ) : (
       <>
         <div className="trending">
          {content.map((c)=>( 
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
