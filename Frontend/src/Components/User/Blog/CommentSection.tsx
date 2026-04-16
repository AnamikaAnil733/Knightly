import React, { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send, Trash2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { CommentDTO } from "../../../Types/BlogTypes";
import {
  addComment,
  getBlogComments,
  deleteComment,
} from "../../../Service/Api/BlogApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/Store";

interface CommentSectionProps {
  blogId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ blogId }) => {
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const user = useSelector((state: RootState) => state.userAuth.user);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBlogComments(blogId);
      setComments(data);
    } catch {
      toast.error("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    fetchComments();
  }, [blogId, fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to leave a comment.");
      return;
    }
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const comment = await addComment({
        blogId,
        content: newComment,
        authorName: user.displayname || "Scholar",
        authorAvatar: user.avatarUrl!,
      });
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
      toast.success("Dispatch shared in the scrolls.");
    } catch {
      toast.error("Failed to share your dispatch.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const success = await deleteComment(commentId);
      if (success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success("Comment removed.");
      }
    } catch {
      toast.error("Failed to remove comment.");
    }
  };

  return (
    <div className="mt-20 space-y-12">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <MessageSquare className="w-8 h-8 text-gold" />
        <h2 className="text-3xl font-cinzel font-bold text-white tracking-widest">
          The <span className="text-gold">Discussion</span>
        </h2>
        <span className="px-3 py-1 bg-navy-card border border-white/10 rounded-full text-xs text-gray-400 font-bold">
          {comments.length} Thoughts
        </span>
      </div>

      {/* Input Section */}
      {user ? (
        <form onSubmit={handleSubmit} className="relative group">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Contribute your wisdom to this chronicle..."
            className="w-full bg-navy-card/30 border border-white/10 rounded-2xl p-6 pt-8 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-all min-h-[120px] resize-none"
          />
          <div className="absolute top-0 left-6 -translate-y-1/2 px-3 py-1 bg-navy-dark border border-white/10 rounded-full text-[10px] uppercase tracking-widest font-bold text-gray-500">
            Your Dispatch
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="flex items-center gap-2 px-8 py-3 bg-gold text-navy-dark font-cinzel font-bold rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span>SHARE THOUGHT</span>
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </form>
      ) : (
        <div className="p-8 bg-navy-card/20 rounded-2xl border border-dashed border-white/10 text-center">
          <p className="text-gray- light font-cinzel tracking-wider">
            You must be <span className="text-gold">Authorized</span> to
            participate in the scrolls.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-8 mt-12">
        {loading ? (
          <div className="text-center py-10 text-gray-500 font-cinzel animate-pulse">
            Consulting the archives...
          </div>
        ) : comments.length > 0 ? (
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative flex gap-6 p-6 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all"
              >
                {/* Author Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/20">
                    {comment.authorAvatar ? (
                      <img
                        src={comment.authorAvatar}
                        alt=""
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gold opacity-50" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white tracking-wider font-cinzel">
                        {comment.authorName}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        • {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {user?.id === comment.authorId && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-light leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-12 text-gray-600 italic">
            The scrolls are silent here. Be the first to share your wisdom.
          </div>
        )}
      </div>
    </div>
  );
};
