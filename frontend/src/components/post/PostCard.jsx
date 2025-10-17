import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import useAuthStore from "../../store/authStore";
import {
  FiEdit2,
  FiHeart,
  FiMessageCircle,
  FiMoreVertical,
  FiTrash,
} from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import usePostStore from "../../store/postStore";
import CreatePost from "./CreatePost";
import useLikeStore from "../../store/likeStore";
import CommentSection from "../comment/CommentSection";

const PostCard = ({ post }) => {
  const { user } = useAuthStore();
  const { deletePost } = usePostStore();
  const { toggleLike } = useLikeStore();

  const menuRef = useRef(null);

  const isOwner = post.user.id == user.id;

  const [showMenu, setShowMenu] = useState(false);
  const [showUpdatePost, setShowUpdatePost] = useState(false);
  const [isLiked, setIsLiked] = useState(post?.liked);
  const [likeCount, setLikeCount] = useState(post?.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post?.commentCount);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this tweet?")) {
      try {
        await deletePost(post.id);
      } catch (err) {
        alert("Failed to delete tweet. Please try again.");
      } finally {
        setShowMenu(false);
      }
    }
  };

  const handleLike = async () => {
    try {
      const response = await toggleLike(post.id);

      setIsLiked(response.isLiked);
      setLikeCount(response.likeCount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutSide);
      return () => {
        document.removeEventListener("mousedown", handleClickOutSide);
      };
    }
  }, [showMenu]);

  return (
    <>
      <div className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <div className="flex items-start p-4 space-x-3">
          <Link to={`/profile/${post.user.id}`}>
            <Avatar user={post.user} size="medium" />
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Link
                to={`/profile/${post.user.id}`}
                className="font-bold text-sm hover:underline"
              >
                {post.user.fullName}
              </Link>
              <Link
                to={`/profile/${post.user.id}`}
                className="text-gray-500 text-sm"
              >
                @{post.user.username}
              </Link>
              <span className="text-gray-500 text-sm">·</span>
              <span className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: ko,
                })}
              </span>

              {isOwner && (
                <div className="ml-auto relative" ref={menuRef}>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    <FiMoreVertical size={16} />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-full mt-1 w-24 bg-white shadow-lg z-50 py-0.5 border border-gray-200 rounded-md">
                      <button
                        className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-50 w-full text-left transition-colors text-sm"
                        onClick={() => setShowUpdatePost(true)}
                      >
                        <FiEdit2 size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="flex items-center space-x-1 px-2 py-1 hover:bg-red-50 text-red-600 w-full text-left transition-colors text-sm"
                        onClick={handleDelete}
                      >
                        <FiTrash size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-sm mb-2">
              <p className="whitespace-pre-wrap break-words">{post.content}</p>
            </div>

            <div className="flex items-center max-w-md space-x-2">
              <button
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors group"
                onClick={() => setShowComments(!showComments)}
              >
                <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                  <FiMessageCircle size={18} />
                </div>
                <span className="text-sm">{commentCount}</span>
              </button>

              <button
                className={`flex items-center space-x-1 transition-colors group ${
                  isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
                onClick={handleLike}
              >
                <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                  <FiHeart
                    size={18}
                    className={`transition-all duration-200 ${
                      isLiked && "fill-current"
                    }`}
                  />
                </div>
                <span className="text-sm">{likeCount}</span>
              </button>
            </div>

            {showComments && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <CommentSection
                  post={post}
                  commentCount={commentCount}
                  setCommentCount={setCommentCount}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {showUpdatePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <CreatePost post={post} onClose={() => setShowUpdatePost(false)} />
        </div>
      )}
    </>
  );
};

export default PostCard;
