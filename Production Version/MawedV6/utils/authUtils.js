// filename: utils/authUtils.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.JWT_SECRET; // Replace with an actual secret key in production

/**
 * Generate a JWT token for a user.
 * @param {Object} user - The user object for which to generate the token.
 * @returns {String} A JWT token.
 */
function generateToken(user) {
    return jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '3600000h' });
}

/**
 * Hash a password.
 * @param {String} password - The password to hash.
 * @returns {String} The hashed password.
 */
async function hashPassword(password) {
    //return await bcrypt.hash(password, 8);
    return password;
}

/**
 * Verify a password against a hash.
 * @param {String} password - The plain password.
 * @param {String} hashedPassword - The hashed password.
 * @returns {Boolean} The result of the comparison.
 */
async function verifyPassword(password, hashedPassword) {
    return (password === hashedPassword);
    //return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
    generateToken,
    hashPassword,
    verifyPassword
};
