import Avatar from "../common/Avatar";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const CommentItem = ({ comment, error }) => {
  return (
    <div className="flex space-x-3 py-2 border-b border-gray-100 last:border-b-0">
      <Avatar user={comment.user} size="small" />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-bold text-sm">
                {comment.user.fullName}
              </span>
              <span className="text-gray-500 text-sm">
                @{comment.user.username}
              </span>
              <span className="text-gray-500 text-sm">·</span>
              <span className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: ko,
                })}
              </span>
            </div>
            <div className="text-sm break-words">{comment.content}</div>
          </div>
        </div>

        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      </div>
    </div>
  );
};

export default CommentItem;