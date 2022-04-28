const { connect } = require('mongoose');
const { collection } = require('./config');
exports.Mongo = connect(`mongodb://0.0.0.0:27017/${collection}`);