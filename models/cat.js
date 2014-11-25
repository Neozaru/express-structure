var mongoose = require('mongoose');

var catSchema = mongoose.Schema({
    name: { type: String, required: true },
    mewowed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Cat', catSchema);