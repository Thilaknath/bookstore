const knexConnection = require('../knex')

const getAll = async () => {
    const books = await knexConnection('books')
    return books
}

const getOne = async ( id ) => {
    const book = await knexConnection('books').where('bookId', id).first()
    return book
}

const getByISBN = async ( id ) => {
    const book = await knexConnection('books').where('isbn', id).first()
    return book
}

const create = async ( book ) => {
    const addBook = await knexConnection('books').insert(book, '*')
    return addBook
}

const update = async (id, book) => {
    const updatedBook = await knexConnection('books').where('bookId', id).update(book, '*')
    return updatedBook
}

const deleteOne = async ( id ) => {
    const book = await knexConnection('books').where('bookId', id).del()
    return book
}


module.exports = {
    getAll,
    getOne,
    getByISBN,
    create,
    update,
    deleteOne
}