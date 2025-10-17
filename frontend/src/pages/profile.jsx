import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFollowStore from "../store/followStore";
import useUserStore from "../store/userStore";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/postStore";
import userService from "../services/user";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileStats from "../components/profile/ProfileStats";
import PostList from "../components/post/PostList";
import EditProfileModal from "../components/profile/EditProfileModal";
import FollowsList from "../components/profile/FollowsList";
const TABS = {
    TWEETS: 'tweets',
    FOLLOWERS: 'followers',
    FOLLOWING: 'following'
  }
const Profile = () => {
  const { userId } = useParams();
  const { followStatus, getFollowStatus, toggleFollow } = useFollowStore();
  const { userProfile, getUserProfile } = useUserStore();
  const { user: currentUser, setAuth } = useAuthStore();
  const { userPosts, userPostCount, getUserPosts, getUserPostCount } = usePostStore();
  const [uploading, setUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const isOwnProfile = currentUser?.id === userProfile?.id;
  
  const [selectedTab, setSelectedTab] = useState(TABS.TWEETS); 

  const handleFollow = async () => {
    try {
      if (!userProfile) return;
      await toggleFollow(userProfile.id);
    } catch (err) { 
      console.error(err);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must not exceed 5MB");
      return;
    }

    try {
      setUploading(true);
      const result = await userService.uploadProfileImage(file);

      const updatedUser = {
        ...currentUser,
        profileImageUrl: result.url,
      };

      setAuth({
        user: updatedUser,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));
      await getUserProfile(userId);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      if (userId) {

        try {
          await getUserProfile(userId);
        } catch (err) {
          console.error(err);
        }
      }else{
        console.error("user id is missing from url");
      }
    };
    loadUserProfile();
  }, [getUserProfile, userId]);

  useEffect(() => {
    if (!userProfile) return;

    const loadProfileData = async () => {
      try {
        await getFollowStatus(userProfile.id);
        await getUserPostCount(userProfile.id);
        getUserPosts(0, userProfile.id);
      } catch (err) {
        console.error(err);
      }
    };

    loadProfileData();
  }, [userProfile, getFollowStatus, getUserPostCount, getUserPosts]);
  const renderContent = () => {
      if (!userProfile?.id) return null; // 프로필 정보가 없으면 로딩 중

      switch (selectedTab) {
          case TABS.TWEETS:
            console.log("tweets");
              // 트윗 목록 (기존 로직)
              return (
                  <div className="grow">
                    post
                      <PostList posts={userPosts} />
                  </div>
              );
          case TABS.FOLLOWERS:
                        console.log("followers");

              // 팔로워 목록 렌더링
              return (
              <div>follower<FollowsList userId={userProfile.id} listType="followers" /></div>);
          case TABS.FOLLOWING:
              // 팔로잉 목록 렌더링
                          console.log("following");

              return (<div>following<FollowsList userId={userProfile.id} listType="following" /></div>);
          default:
              return null;
      }
  };
  return (
    <div className="bg-gray-50">
      <div className="bg-white min-h-screen max-w-2xl mx-auto flex flex-col">
        <ProfileHeader username={userProfile?.username} />

        <ProfileInfo
          userProfile={userProfile}
          isOwnProfile={isOwnProfile}
          uploading={uploading}
          onEditProfile={() => setShowEditModal(true)}
          onFollow={handleFollow}
          onImageChange={handleFileChange}
          followStatus={followStatus}
        />

        <ProfileStats
          selectedTab={selectedTab}
          onTabChange={setSelectedTab} 
          
          postCount={userPostCount}
          followersCount={followStatus?.followersCount}
          followingCount={followStatus?.followingCount}
        />

        <div className="border-t-2 border-gray-300 p-4 grow flex flex-col justify-center">
          {userPostCount === 0 ? (
            <div className="flex justify-center">No tweets yet.</div>
          ) : (
            <div className="grow">
                {renderContent()}
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          onClose={() => {
            setShowEditModal(false);
            getUserProfile(userId);
          }}
          currentProfile={userProfile}
        />
      )}
    </div>
  );
};

export default Profile;