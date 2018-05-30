const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deckSchema = new Schema({
  title: String,
  description: String,
  tag: [String],
  category: String,
  ankiId: [{
    type: Schema.Types.ObjectId,
    ref: 'Anki'
  }],
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Deck = mongoose.model('Deck', deckSchema);
module.exports = Deck;
