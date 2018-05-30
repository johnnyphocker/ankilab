const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ankiSchema = new Schema({
  term: String,
  definition: String,
  tips: String
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Anki = mongoose.model('Anki', ankiSchema);
module.exports = Anki;
