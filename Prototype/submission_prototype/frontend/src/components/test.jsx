import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Avatar, Typography, Rate, Form, Input, Button, Spin, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Meta } = Card;
const { Text } = Typography;

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(true);

  useEffect(() => {
    fetchReviews(); // Initial fetch when component mounts
  }, []);

  const fetchReviews = () => {
    axios.get('http://localhost:3001/reviews')
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  };

  const handleReviewSubmit = () => {
    if (!reviewerName || !reviewContent || reviewRating === 0) {
      message.error('Please fill out all fields and rating before submitting.');
      return;
    }

    const newReview = {
      name: reviewerName,
      content: reviewContent,
      rating: reviewRating
    };

    setLoading(true);

    axios.post('http://localhost:3001/reviews', newReview)
      .then(response => {
        console.log('Review submitted:', response.data);

        message.success('Review submitted successfully!');
        setReviewerName('');
        setReviewContent('');
        setReviewRating(0);
        setShowReviewForm(false);

        // After successful submission, fetch reviews again to refresh the list
        fetchReviews();
      })
      .catch(error => {
        console.error('Error submitting review:', error);
        message.error('Failed to submit review. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="clinic-profile-container">
      

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Spin size="large" />
        </div>
      ) : (
        reviews.map(review => (
          <Card key={review._id} style={{ margin: '16px 0' }}>
            <Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={review.name}
              description={
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>{review.content}</Text>
                    <Rate disabled defaultValue={review.rating} />
                  </div>
                </>
              }
            />
          </Card>
        ))
      )}

      {showReviewForm && (
        <Card key="add-review" style={{ margin: '16px 0' }}>
          <Meta
            title="Leave a Review"
            description={
              <Form layout="vertical">
                <Form.Item label="Your Name">
                  <Input value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} />
                </Form.Item>
                <Form.Item label="Your Review">
                  <Input.TextArea value={reviewContent} onChange={(e) => setReviewContent(e.target.value)} />
                </Form.Item>
                <Form.Item label="Rating">
                  <Rate value={reviewRating} onChange={(value) => setReviewRating(value)} />
                </Form.Item>
                <Button type="primary" onClick={handleReviewSubmit}>
                  Submit Review
                </Button>
              </Form>
            }
          />
        </Card>
      )}
    </div>
  );
};

export default Reviews;
