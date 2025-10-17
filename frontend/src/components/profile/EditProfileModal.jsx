import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import Button from "../ui/Button";
import Input from "../ui/Input";
import userService from "../../services/user";
import useAuthStore from "../../store/authStore";

const EditProfileModal = ({ onClose, currentProfile }) => {
  const { user, setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentProfile) {
      setFormData({
        fullName: currentProfile.fullName || "",
        bio: currentProfile.bio || "",
      });
    }
  }, [currentProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.fullName.length > 100) {
      setError("Full name must not exceed 100 characters");
      return;
    }

    if (formData.bio.length > 160) {
      setError("Bio must not exceed 160 characters");
      return;
    }

    try {
      setLoading(true);
      const updatedProfile = await userService.updateProfile(formData);

      const updatedUser = {
        ...user,
        fullName: updatedProfile.fullName,
        bio: updatedProfile.bio,
      };

      setAuth({
        user: updatedUser,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 form-group">
          {error && <div className="input-error">{error}</div>}

          <div>
            <label className="text-label">
              Full Name
            </label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              maxLength={100}
            />
            <p className="text-small-caption">
              {formData.fullName.length}/100
            </p>
          </div>

          <div>
            <label className="text-label">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              maxLength={160}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-small-caption">
              {formData.bio.length}/160
            </p>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;