const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const folderSchema = new Schema({
  title: String,
  description: String,
  deckId: {
    type: Schema.Types.ObjectId,
    ref: 'Deck'
  },
  category: [],
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

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;
