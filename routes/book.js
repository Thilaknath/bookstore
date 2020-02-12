const express = require('express')
const router = express.Router()
const queries = require('../db/models/book')
const isValidId = require('../middleware/validations').isValidId
const isValidBookInfo = require('../utils/validations').isValidBookInfo
const updateBookInfo = require('../utils/update-bookinfo').updateBookInfo

router.get('/', async (req, res) => {
    const books = await queries.getAll()
    res.send(books)
})

router.get('/:id', isValidId, async (req, res) => {
    const { id } = req.params
    const book = await queries.getOne(id)
    if(!book)
        return res.status(200).send('No Book matches the given id')

    res.send(book)
})

router.post('/', async(req, res, next) => {
    const isBookInfoValid = await isValidBookInfo(req.body, true)
    if(!isBookInfoValid)
       return next(new Error('Please enter all fields(isbn, title, description)'))    
    
    const existingBook = await queries.getByISBN(req.body.isbn)
    if(existingBook)
        return next(new Error('Book already exists!'))
    
    const book = {...req.body}
    
    if( book.availableQuantity && book.totalQuantity && book.availableQuantity > book.totalQuantity )
        return next(new Error('Total Books must greater than available books'))    
     
    book.createdAt = new Date()
    book.updatedAt = new Date()

    // I am updating only available status. 
    // I'm doing out of stocks in scheduled-scripts that runs every minute based on my understanding of the last question
    if(book.availableQuantity > 0)
        book.status = 'Available'
    
    try {
        await queries.create(req.body)
        return res.status(200).send({ status : 'success', message :'created'})
    } catch (error) {
        return next(new Error('Insertion Failed')) 
    }
    
})

router.put('/:id', isValidId, async (req, res, next) => {

    const isBookInfoValid = await isValidBookInfo(req.body)
    if(!isBookInfoValid)
        return next(new Error('Book Information entered is invalid'))

    try {
        const book = await updateBookInfo(req.params.id, req.body)
        await queries.update(req.params.id, book)
        return res.status(200).send({ status : 'success', message :'updated'})
    } catch (error) {
        return next(new Error('Update operation failed'))
    }
})

router.delete('/:id', isValidId, async (req, res) => {
    const { id } = req.params
    try {        
        await queries.deleteOne(id)         
        return res.status(200).send({ status : 'success', message :'deleted'})
    } catch (error) {
        return next(new Error('Deletion Failed')) 
    }
})

router.put('/update/stocks', async (req, res, next) => {
    const stocks = req.body    
    const errors = []
          
    for(let i = 0; i < stocks.length; i++) {
        const bookInfo = stocks[i]
        try {
            const book = await updateBookInfo(bookInfo.bookId, bookInfo, true )
            await queries.update(bookInfo.bookId, book)
        } catch (error) {
            errors.push(`${error.message}`)
        }       
    }   

    if(errors.length)
        return next(new Error(JSON.stringify(errors)))
    
    return res.status(200).send({ status : 'success', message :'updated'}) 
})

module.exports = router