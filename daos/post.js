const Post = require('../models/post');

module.exports = {};

module.exports.create = async (userId, description, fileType) => {
    const post = await Post.create({userId, description, fileType});
    return post;
}

module.exports.getAll = async (skip, limit) => {
    const posts = await Post.find({}).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    return posts;
}

module.exports.getAllByKeyword = async (keyword) => {
    const posts = await Post.find({ $text: { $search: keyword } }).sort({ updatedAt: -1 });
    return posts;
}

module.exports.getAllByUser = async (userId) => {
    const posts = await Post.find({userId});
    return posts;
}

module.exports.getById = async (postId) => {
    const post = await Post.findOne({_id: postId});
    return post;
}

module.exports.edit = async (postId, newDescription) => {
    const post = await Post.findOneAndUpdate({ _id: postId },{ $set: { description: newDescription } }, {new: true} );
    return post;
}

module.exports.delete = async (postId) => {
    await Post.deleteOne({ _id: postId });
    return;
}