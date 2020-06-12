const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
// const bookingController = require('../controllers/bookingController');

const {
  getOverview,
  getTour,
  getLogin,
  getAccount,
  updateUserData,
  getMyTours,
  alerts
} = viewsController;

const { isLoggedIn, protect } = authController;

// const { createBookingCheckout } = bookingController;

const router = express.Router();

router.use(alerts);

router.get('/', getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLogin);
router.get('/me', protect, getAccount);
router.get(
  '/my-tours',
  // createBookingCheckout,
  protect,
  getMyTours
);

router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
