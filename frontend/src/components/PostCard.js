import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/postcard.css";

export default function PostCard({ post, onPostUpdated }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const liked = post.likes.includes(user?.name);

  const handleLike = async () => {
    try {
      const res = await api.post(`/posts/${post._id}/like`);
      onPostUpdated(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/posts/${post._id}/comment`, { text: commentText });
      onPostUpdated(res.data);
      setCommentText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (dateStr) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-avatar">{post.username.charAt(0).toUpperCase()}</div>
        <div>
          <div className="post-username">{post.username}</div>
          <div className="post-time">{timeAgo(post.createdAt)}</div>
        </div>
      </div>

      {post.text && <p className="post-text">{post.text}</p>}
      {post.image && <img src={post.image} alt="post" className="post-image" />}

      <div className="post-stats">
        <span>{post.likes.length} {post.likes.length === 1 ? "like" : "likes"}</span>
        <span onClick={() => setShowComments((s) => !s)} className="post-stats-comments">
          {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      <div className="post-actions">
        <button
          className={`post-action-btn ${liked ? "liked" : ""}`}
          onClick={handleLike}
        >
          {liked ? "❤️ Liked" : "🤍 Like"}
        </button>
        <button className="post-action-btn" onClick={() => setShowComments((s) => !s)}>
          💬 Comment
        </button>
      </div>

      {showComments && (
        <div className="post-comments">
          {post.comments.map((c, idx) => (
            <div className="post-comment" key={idx}>
              <span className="post-comment-username">{c.username}</span>{" "}
              <span className="post-comment-text">{c.text}</span>
            </div>
          ))}

          <form className="post-comment-form" onSubmit={handleComment}>
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="post-comment-input"
            />
            <button type="submit" className="post-comment-submit" disabled={submitting}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
