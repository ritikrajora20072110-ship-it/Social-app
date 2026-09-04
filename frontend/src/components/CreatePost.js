import React, { useState, useRef } from "react";
import api from "../api/axios";
import "../styles/createpost.css";

export default function CreatePost({ onPostCreated }) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setError("Image is too large. Please choose a file under 4MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // base64 data URL
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    setError("");

    if (!text.trim() && !imagePreview) {
      setError("Write something or add an image before posting.");
      return;
    }

    setPosting(true);
    try {
      const res = await api.post("/posts", { text, image: imagePreview || "" });
      onPostCreated(res.data);
      setText("");
      removeImage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="create-post-card">
      <h2 className="create-post-title">Create Post</h2>

      <textarea
        className="create-post-textarea"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />

      {imagePreview && (
        <div className="create-post-preview-wrap">
          <img src={imagePreview} alt="preview" className="create-post-preview" />
          <button className="create-post-remove-img" onClick={removeImage}>
            Remove
          </button>
        </div>
      )}

      {error && <div className="create-post-error">{error}</div>}

      <div className="create-post-footer">
        <label className="create-post-icon-btn">
          📷
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            hidden
          />
        </label>

        <button
          className="create-post-submit"
          onClick={handleSubmit}
          disabled={posting}
        >
          {posting ? "Posting..." : "➤ Post"}
        </button>
      </div>
    </div>
  );
}
