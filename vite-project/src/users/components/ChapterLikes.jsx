import React from 'react'
import { useState,useEffect } from 'react';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc'
import useApi from '../../Axios_instance/axios'


function ChapterLikes({chapter_id}) {
    const [liked, setLiked] = useState(false);
    const [likesCount, SetlikesCount] = useState('');
    const api = useApi();
  
    const handleClick = async () => {
        setLiked(!liked);
        try {
            const response = await api.post(`courses-about/toggleLike/${chapter_id}/`, {
                
            });
            if (response.status === 200) {
                const data = response.data;
                const { is_liked, likes_count } = data;
                setLiked(is_liked);
                SetlikesCount(likes_count);
                    
                
                
            } else {
                
            }
        } catch (error) {
            console.error("Error saving the comment:", error);
        }
    }

    const FetchCount_Status = async () => {
        
      
        try {
            const response = await api.get(`courses-about/toggleLike/${chapter_id}/`, {
                
            });
            if (response.status === 200) {
                const data = response.data;
                const { is_liked, likes_count } = data;
                setLiked(is_liked);
                SetlikesCount(likes_count);
                    
                    
            } else {
                
            }
        } catch (error) {
            console.error("Error saving the comment:", error);
        }
    }


    useEffect(() => {
        
        
        FetchCount_Status();
    }, [chapter_id,liked]);



  return (
    <div className=' space-x-2  mt-4'  style={{ display: 'flex', alignItems: 'center' }}>
    <button className=' ml-4'  onClick={handleClick}>
     {liked ? <FcLike style={{ fontSize: '34px' }}/>  : <FcLikePlaceholder style={{ fontSize: '34px' }}/>} 
     </button>
     <span className='font-semibold'>{likesCount} Likes</span>
     
     
    
     </div>

  )
}

export default ChapterLikes