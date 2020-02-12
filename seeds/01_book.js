const books = require('../constants/booklist')

exports.seed = function(knex) {
  return knex('books').del()
    .then(function () {
      return knex('books').insert(books);
    });
};
