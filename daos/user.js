const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = {};

module.exports.findById = async (userId) => {
    const user = await User.findOne({_id: userId});
    return user;
}

module.exports.create = async (username, email, plaintextPassword) => {
    const hashedPassword = await bcrypt.hash(plaintextPassword, 10);
    const user = await User.create({username, email, password: hashedPassword});
    return user;
}

module.exports.changePassword = async (userId, plaintextPassword) => {
    const hashedPassword = await bcrypt.hash(plaintextPassword, 10);
    await User.updateOne({_id: userId}, {password: hashedPassword});
}

module.exports.login = async (username, plaintextPassword) => {
    const user = await User.findOne({username});
    if (!user) {
        return undefined;
    }
    const hasValidPassword = await bcrypt.compare(plaintextPassword, user.password);
    if (hasValidPassword) {
        return user;
    } else {
        return undefined;
    }
}