import React, { useEffect, useState } from 'react';
import followService from '../../services/follow';


const FollowsList = ({ userId, listType }) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchFollows = async (pageNumber) => {
   
    if (!userId || !hasMore || (loading && pageNumber !== 0)) return;
    
    setLoading(true);
    let response;

    try {
      if (listType === 'followers') {
        response = await followService.getFollowerList(userId, pageNumber);
      } else if (listType === 'following') {
        response = await followService.getFollowingList(userId, pageNumber);
      } else {
        setLoading(false);
        return;
      }
      
      setUsers(prev => {
          if (pageNumber === 0) {
              return response.content; 
          }
          
          const existingIds = new Set(prev.map(u => u.id)); 
          const newUniqueUsers = response.content.filter(u => !existingIds.has(u.id));
          
          return [...prev, ...newUniqueUsers];
      });

      setHasMore(!response.last); 
      setPage(pageNumber + 1);

    } catch (error) {
      console.error(`Error fetching ${listType}:`, error);
      setHasMore(false); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setLoading(false); 

    if (userId) {
      fetchFollows(0); 
    }
    
  }, [userId, listType]); 


  if (!users.length && loading) {
    return <div className="text-center p-4">로딩 중...</div>;
  }
  
  if (!users.length && !hasMore) {
    const emptyMessage = listType === 'followers' ? '팔로워가 없습니다.' : '팔로잉하는 사용자가 없습니다.';
    return <div className="text-center p-4">{emptyMessage}</div>;
  }

  return (
    <div>
      {users.map(user => (
        <div key={user.id} className="p-3 border-b hover:bg-gray-50 transition-colors">
          <p className="font-semibold">{user.fullName} (@{user.username})</p>
          <p className="text-sm text-gray-600">{user.bio}</p> 
        </div>
      ))}
      
      
    </div>
  );
};

export default FollowsList;