const Post = require('../models/post');

module.exports = {};

module.exports.create = async (userId, description) => {
    const post = await Post.create({userId, description});
    return post;
}

module.exports.getAll = async () => {
    const posts = await Post.find({});
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