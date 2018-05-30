const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  deckId: {
    type: Schema.Types.ObjectId,
    ref: 'Deck'
  },
  score: Number
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Deck = mongoose.model('Deck', scoreSchema);
module.exports = Deck;
