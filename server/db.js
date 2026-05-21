const Datastore = require('nedb-promises');
const path = require('path');

const users = Datastore.create({
  filename: path.join(__dirname, 'data_users.db'),
  autoload: true,
});

const messages = Datastore.create({
  filename: path.join(__dirname, 'data_messages.db'),
  autoload: true,
});

users.ensureIndex({ fieldName: 'email', unique: true });
users.ensureIndex({ fieldName: 'username', unique: true });
messages.ensureIndex({ fieldName: 'conversation_id' });
messages.ensureIndex({ fieldName: 'user_id' });

module.exports = { users, messages };
