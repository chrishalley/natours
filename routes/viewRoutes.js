const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const {
  getOverview,
  getTour,
  getLogin,
  getAccount,
  updateUserData,
  getMyTours
} = viewsController;

const { isLoggedIn, protect } = authController;

const { createBookingCheckout } = bookingController;

const router = express.Router();

router.get('/', createBookingCheckout, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLogin);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);

router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
