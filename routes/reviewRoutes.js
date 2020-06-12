const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const {
  createReview,
  getReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourUserIds
} = reviewController;

const { protect, restrictTo } = authController;

const router = new express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
