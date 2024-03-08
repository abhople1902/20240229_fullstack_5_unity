// Internal Imports
const Review = require("../models/Review")
const Product = require("../models/Product")

const {
    checkAbusiveWords,
    validateReviewLength,
    validateRating,
} = require("../dependencies/validators/Reviews");

const {
    isValidCategory,
    isValidRating,
    isValidPrice,
    queryValidator
} = require("../dependencies/validators/Product");

// Sample array to store reviews
let reviews = [];

// Controller for adding a review
async function addReview(req, res) {
    const productId = req.params.id

    const {
        ratingTitle,
        ratingDescription,
        ratings
    } = req.body;

    if (!validateRating(req, res)) {
        return res.status(400).json({ error: 'Rating should be a number between 1 and 5 (inclusive).' });
    }

    const review = new Review({
        ratingTitle,
        ratingDescription,
        ratings,
        productId,
        userId: req.user.id,
    });


    try {
        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Assuming review is an object with a 'ratings' property
        if (product.ratings) {
            const newRating = (product.ratings * product.reviews.length + review.ratings) / (product.reviews.length + 1);
            product.ratings = newRating;
        } else {
            product.ratings = review.ratings;
        }

        product.reviews.push(review._id)

        await product.save();
        await review.save();

        return res.status(200).json({ review });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

/** Controller for handling product search and sorting */
// Search and filter products
async function searchProducts(req, res) {
    // /search?search_query=abcd&category=efgh&...
    const {
        search_query,
        category,
        ratings,
        price,
        sort
    } = req.query;

    // Perform the actual search logic 
    let results = await Product.find({})

    try {
        if (search_query) {
            // validate the query
            const queryError = queryValidator(search_query);
            if (!queryError) {
                // If there's an error, return a 400 status with the error message
                return res.status(400).json({ message: 'Please check the spelling or try searching for something else' });
            }
            results = results.filter(product =>
                product.title.toLowerCase().includes(search_query.toLowerCase())
            );
        }
        if (category) {
            if (isValidCategory(category)) {
                results = filterResultsByCategory(results, category);
            }
            else {
                return res.status(400).json({ message: 'Does not exist' })
            }
        }
        if (ratings) {
            if (isValidRating(ratings)) {
                results = filterResultsByRating(results, ratings);
                // product.rating >= minRating && product.rating <= maxRating
                // results = results.filter(product =>
                //     product.ratings >= minRating && product.ratings <= maxRating
                // );
            } else {
                return res.status(400).json({ message: "Rating should be between 1 and 5" });
            }
        }

        if (price) {
            // Check if price is a valid number
            if (isValidPrice(price)) {
                // Filter results using a function (e.g., filterResultsByPrice) if needed
                results = filterResultsByPrice(results, price);
            } else {
                return res.status(400).json({ message: "Price should be a number greater than or equal to 10." });
            }
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No products found" })
        }
        // Handle sorting
        if (sort) {
            results = sortResults(results, sort);
        }

        res.json({ results });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Controller to get trending products
async function getTrendingProductsController(req, res) {
    const { role } = req.user;
    try {

        if (role === 'seller') {
            // Assuming seller-specific logic to fetch seller's products
            const sellerProducts = products.filter(product => product.seller_id === userId);
            res.json({ sellerProducts });
        } else if (role === 'user') {
            const trendingProducts = getTrendingProducts(products);
            res.json({ trendingProducts });
        } else {
            res.status(403).json({ message: 'Invalid role' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Implement your logic to sort by rating, price, or default to sorting by name
function sortResults(results, sortField) {
    switch (sortField) {
        case 'rating':
            results.sort((a, b) => a.rating - b.rating);
            break;
        case 'price':
            results.sort((a, b) => a.price - b.price);
            break;
        default:
            results.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    return results;
}

// Implement your logic to filter by category
function filterResultsByCategory(results, category) {
    return results.filter(product => product.category.toLowerCase() == category.toLowerCase());
}

// Implement your logic to filter by rating
function filterResultsByRating(results, ratings) {
    return results.filter(product => product.ratings >= parseFloat(ratings));
}

// Implement your logic to filter by price range
function filterResultsByPrice(results, priceRange) {
    const [minPrice, maxPrice] = priceRange.split('-').map(parseFloat);
    return results.filter(product => product.price >= minPrice && product.price <= maxPrice);
}

function getTrendingProducts(products) {
    return products.filter(product => product.trending);
}

module.exports = {
    addReview,
    searchProducts,
    getTrendingProductsController,
};
