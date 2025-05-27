const Conversation = require('../models/conversation');

module.exports = {};

module.exports.create = async (userId1, userId2) => {
    const conversation = await Conversation.create({userId1: userId1, userId2: userId2});
    return conversation;
}

module.exports.getById = async (conversationId) => {
    const post = await Conversation.findOne({_id: conversationId});
    return post;
}

module.exports.getAllByUserId = async (userId) => {
    const conversations = await Conversation.find({
        $or: [{ userId1: userId }, { userId2: userId }]
    }).sort({ updatedAt: -1 });
    return conversations;
}