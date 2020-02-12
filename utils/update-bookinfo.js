const queries = require('../db/models/book')

const updateBookInfo = async (id, body, stocksOnly = false) => {
    const book = await queries.getOne(id)
    const { incrementTotalQuantityBy, decrementTotalQuantityBy, incrementAvailableQuantityBy, decrementAvailableQuantityBy } = body

    if(!stocksOnly) {
        book.title = body.title
        book.subTitle = body.subTitle
        book.author = body.author
        book.publisher = body.publisher
        book.description = body.description
        book.pages = body.pages
        book.author = body.author
        book.totalQuantity = body.totalQuantity
        book.availableQuantity = body.availableQuantity
    }
    

    if(incrementTotalQuantityBy) {
        book.totalQuantity += incrementTotalQuantityBy 
    } else if(decrementTotalQuantityBy) {
        book.totalQuantity -= decrementTotalQuantityBy  
    }

    if(incrementAvailableQuantityBy) {
        book.availableQuantity += incrementAvailableQuantityBy
    } else if(decrementAvailableQuantityBy) {        
        book.availableQuantity -= decrementAvailableQuantityBy
    }

    if ( book.totalQuantity < book.availableQuantity )
        throw new Error(`Available books should be less than total books available for ${book.title}`)

    if(book.availableQuantity > 0)
        book.status = 'Available'  
    
    book.updatedAt = new Date()        
    return book
}

module.exports = {
    updateBookInfo
}