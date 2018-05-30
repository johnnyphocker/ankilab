const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userId = {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comment: String,
  status: {
    type: Boolean,
    default: true
  }
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Comment = mongoose.model('Comment', commentSchema);
exports.module = Comment;
