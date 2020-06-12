const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty']
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Prevent users writing multiple reviews for the same tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name'
  // }).populate({
  //   path: 'tour',
  //   select: 'name photo'
  // });
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

// calculate and save tour rating stats on review creation
reviewSchema.post('save', function() {
  // the this keyword points to current document being saved
  // since the Review model has not yet been defined, we need
  // to reference the document's constructor to access static methods
  this.constructor.calcAverageRatings(this.tour);
});

// calculate and save tour rating stats on review update and delete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  // findOneAndUpdate and findOneAndDelete only have access to query
  // middleware, not document middleware. Therefore we need to execute
  // the query first so as to get access to the document.
  const reviewDoc = await this.findOne();
  // save the document onto the query object to pass forward into the post middleware
  this.r = reviewDoc;
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // console.log({ r: this.r });
  // reference the Model on the review document's constructor
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

// Nested Route to create a review:
// POST /tour/:id/reviews
