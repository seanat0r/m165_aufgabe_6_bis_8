const mongoose = require('mongoose');

// Schema definieren
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    }
});

// Modell erstellen
const User = mongoose.model('User', userSchema);

module.exports = User;