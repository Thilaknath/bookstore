
exports.up = function(knex, Promise) {
    return knex.schema.createTable('books', (table) => {
        table.increments('bookId').primary();
        table.text('title').notNullable();
        table.text('subtitle').defaultTo('');
        table.text('author').defaultTo('');
        table.text('description').notNullable();
        table.text('publisher').defaultTo('');
        table.text('status').defaultTo('');
        table.integer('isbn').unique().notNullable();
        table.integer('pages').defaultTo(0);
        table.integer('totalQuantity').defaultTo(0);
        table.integer('availableQuantity').defaultTo(0);
        table.datetime('updatedAt');
        table.datetime('createdAt');
    });  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books')
};
