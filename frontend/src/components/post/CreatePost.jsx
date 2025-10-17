import { FiX } from "react-icons/fi";
import Avatar from "../common/Avatar";
import usePostStore from "../../store/postStore";
import { useState } from "react";
import useAuthStore from "../../store/authStore";

const CreatePost = ({ post, onClose }) => {
  const { createPost, updatePost, loading, error } = usePostStore();
  const { user } = useAuthStore();

  const [content, setContent] = useState(post ? post.content : "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    if (content.length > 280) {
      return;
    }

    try {
      if (post) {
        await updatePost(post.id, {
          content: content.trim(),
        });
      } else {
        await createPost({
          content: content.trim(),
        });
      }

      setContent("");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          {post ? "Edit Tweet" : "What's happening?"}
        </h2>
        <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
          <FiX size={24} />
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex items-start space-x-3">
          <Avatar user={user} size="medium" />
          <div className="flex-1">
            <textarea
              className="w-full px-3 py-2 text-xl placeholder-gray-500 border-none resize-none focus:outline-none"
              placeholder="What's happening?"
              rows="3"
              maxLength={280}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              <span className={content.length > 280 ? "text-red-500" : ""}>
                {content.length}/280
              </span>
            </div>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {content.length > 0 && "Everyone can reply"}
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            disabled={loading || !content.trim() || content.length > 280 || content === post?.content}
          >
            {loading ? "Tweeting..." : "Tweet"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;