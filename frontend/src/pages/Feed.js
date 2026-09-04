import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import "../styles/feed.css";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async (pageToLoad) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/posts?page=${pageToLoad}&limit=10`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.page || pageToLoad);
    } catch (err) {
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handlePostCreated = (newPost) => {
    // Show new post instantly at the top of the feed
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  return (
    <div className="feed-page">
      <Navbar />

      <div className="feed-container">
        <CreatePost onPostCreated={handlePostCreated} />

        {error && <div className="feed-error">{error}</div>}

        {loading ? (
          <div className="feed-loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="feed-empty">
            <div className="feed-empty-icon">📭</div>
            <p>Nothing here yet, check back soon!</p>
          </div>
        ) : (
          <div className="feed-list">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="feed-pagination">
            <button
              disabled={page <= 1}
              onClick={() => fetchPosts(page - 1)}
              className="feed-page-btn"
            >
              Previous
            </button>
            <span className="feed-page-info">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => fetchPosts(page + 1)}
              className="feed-page-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
