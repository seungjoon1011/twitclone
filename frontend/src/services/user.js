import api from "./api";

const userService = {
  getUserProfile: async (userId) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },

  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/api/upload/profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/api/users/profile", data);
    return response.data;
  },
};

export default userService;