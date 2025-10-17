import api from "./api";
const FOLLOW_API_BASE_URL = "/api/users";
const followService = {
  toggleFollow: async (userId) => {
    const response = await api.post(`${FOLLOW_API_BASE_URL}/${userId}/follow`);
    return response.data;
  },

  getFollowStatus: async (userId) => {
    const response = await api.get(`${FOLLOW_API_BASE_URL}/${userId}/follow-status`);
    return response.data;
  },
   
  getFollowerList: async (userId, page = 0, size = 20) => {
    const response = await api.get(
      `${FOLLOW_API_BASE_URL}/${userId}/followers`,
      {
        params: { page, size, sort: "createdAt,desc" }, 
      }
    );
    return response.data;
  },

  
  getFollowingList: async (userId, page = 0, size = 20) => {
    const response = await api.get(
      `${FOLLOW_API_BASE_URL}/${userId}/following`,
      {
        params: { page, size, sort: "createdAt,desc" },
      }
    );
    return response.data;
  }
};

export default followService;