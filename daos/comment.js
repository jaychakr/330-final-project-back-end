const Comment = require('../models/comment');

module.exports = {};

module.exports.create = async (userId, postId, description) => {
    const comment = await Comment.create({userId, postId, description});
    return comment;
}

module.exports.getAll = async (postId) => {
    const comments = await Comment.find({postId});
    return comments;
}

module.exports.getById = async (commentId) => {
    const comment = await Comment.findOne({_id: commentId});
    return comment;
}

module.exports.edit = async (commentId, newDescription) => {
    const comment = await Comment.findOneAndUpdate({ _id: commentId },{ $set: { description: newDescription } }, {new: true} );
    return comment;
}

module.exports.delete = async (commentId) => {
    await Comment.deleteOne({ _id: commentId });
    return;
}