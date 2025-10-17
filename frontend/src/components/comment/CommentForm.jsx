import { FiSend } from "react-icons/fi";
import useCommentStore from "../../store/commentStore";
import { useState } from "react";

const CommentForm = ({ postId, commentCount, setCommentCount }) => {
  const { createComment, error } = useCommentStore();

  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    if (content.length > 280) return;

    try {
      await createComment(postId, content);

      setContent("");
      setCommentCount(commentCount + 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-3">
      <div className="flex-1">
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          rows="2"
          maxLength={280}
          placeholder="Reply to this tweet..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">{content.length}/280</span>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </div>

      <button
        type="submit"
        className="self-start mt-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiSend size={16} />
      </button>
    </form>
  );
};

export default CommentForm;
