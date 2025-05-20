import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/reviews/${productId}`);
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
      } catch (err) {
        setError('Failed to load reviews');
      }
    };
    fetchReviews();
  }, [productId]);

  return (
    <div>
      <h3>Reviews</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Average Rating: {averageRating.toFixed(1)} / 5</p>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <p><strong>{review.name}</strong>: {review.rating} / 5</p>
              <p>{review.comment}</p>
              <p><small>{new Date(review.created_at).toLocaleDateString()}</small></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reviews;