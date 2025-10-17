import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/postStore";
import MainLayout from "../components/layout/MainLayout";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/layout/BottomNavigation";
import Loading from "../components/common/Loading";
import PostList from "../components/post/PostList";
import CreatePost from "../components/post/CreatePost";

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { posts, loading, fetchPosts } = usePostStore();

  const [activeTab, setActiveTab] = useState("home");
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "profile") {
      navigate(`/profile/${user?.id}`);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <MainLayout>
      <Header onCreatePost={() => setShowCreatePost(true)} onLogout={handleLogout} />

      <main className="pt-16 pb-20">
        <div className="p-4">
          {loading ? <Loading /> : <PostList posts={posts} />}
        </div>
      </main>

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onCreatePost={() => setShowCreatePost(true)}
        user={user}
      />

      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <CreatePost onClose={() => setShowCreatePost(false)} />
        </div>
      )}
    </MainLayout>
  );
};

export default Home;