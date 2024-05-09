const mongoose = require('mongoose');

class ReviewsSchema extends mongoose.Schema {
    constructor() {
        super({
            name: String,
            content: String,
            rating: Number
        });
    }
}

class ReviewsModel {
    constructor() {
        this.model = mongoose.model('reviews', new ReviewsSchema());
    }

    async saveReview(data) {
        try {
            const newReview = new this.model(data);
            await newReview.save();
            return newReview;
        } catch (error) {
            throw new Error('Failed to save review');
        }
    }

    async getAllReviews() {
        try {
            const reviews = await this.model.find();
            return reviews;
        } catch (error) {
            throw new Error('Failed to fetch reviews');
        }
    }
}

module.exports = new ReviewsModel();
