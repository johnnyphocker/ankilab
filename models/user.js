const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es necesario']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es necesaria']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El email es neecsario']
  },
  birthday: {
    type: Date,
    // required: true
  },
  sex: {
    type: String,
    // required: true
  },
  role: {
    type: String,
    enum: ['student','teacher'],
    default: 'student'
  },
  interest: [],
  bio: String,
  imgProfile: String,
  imgCover: String,
  deckId: [{
    type: Schema.Types.ObjectId,
    ref: 'Deck'
  }],
  scoreId: [{
    type: Schema.Types.ObjectId,
    ref: 'Score'
  }],
  status: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

userSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});

const User = mongoose.model('User',userSchema);
module.exports = User;
