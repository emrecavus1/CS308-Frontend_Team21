import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "./Comments.css";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/main/reviews/pending-comments");
        const rawComments = res.data;

        const enriched = await Promise.all(
          rawComments.map(async (comment) => {
            const [userRes, productRes] = await Promise.all([
              axios.get(`http://localhost:8080/api/auth/user/${comment.userId}`),
              axios.get(`http://localhost:8080/api/main/products/${comment.productId}`)
            ]);

            return {
              userName: `${userRes.data.name} ${userRes.data.surname}`,
              productName: productRes.data.productName,
              commentText: comment.comment,
              userId: comment.userId,
              productId: comment.productId,
              reviewId: comment.reviewId
            };
          })
        );

        setComments(enriched);
      } catch (err) {
        console.error(err);
        setError("Failed to load comments.");
      }
    };

    fetchComments();
  }, []);

  const handleApprove = async (reviewId) => {
    try {
      await axios.post(`http://localhost:8080/api/main/approveReview/${reviewId}`);
      setComments(prev => prev.filter(c => c.reviewId !== reviewId));
    } catch {
      alert("Failed to approve comment.");
    }
  };
  
  const handleDecline = async (reviewId) => {
    try {
      await axios.post(`http://localhost:8080/api/main/declineReview/${reviewId}`);
      setComments(prev => prev.filter(c => c.reviewId !== reviewId));
    } catch {
      alert("Failed to decline comment.");
    }
  };
  

  return (
    <>
      <Header />
      <div className="comments-container">
        <h1 className="comments-title">Pending Comments</h1>
        {error && <p className="comments-error">{error}</p>}
        {comments.map((c, idx) => (
          <div key={idx} className="comment-card">
            <p><strong>User:</strong> {c.userName}</p>
            <p><strong>Product:</strong> {c.productName}</p>
            <p><strong>Comment:</strong> {c.commentText}</p>
            <div className="comment-buttons">
              <button onClick={() => handleApprove(c.reviewId)} className="approve-btn">✅ Approve</button>
              <button onClick={() => handleDecline(c.reviewId)} className="decline-btn">❌ Decline</button>
            </div>
          </div>
        ))}
        {comments.length === 0 && !error && <p>No pending comments left.</p>}
      </div>
    </>
  );
}
