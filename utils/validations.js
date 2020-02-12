const isValidBookInfo = async ( book, creationStatus = false ) => {
    const { isbn, title, author, description, publisher, totalQuantity, availableQuantity, pages } = book
    const isValidTitle = typeof title === 'string' && title.trim() != ''
    const isValidDescription = typeof description === 'string' && description.trim() != ''
    const isValidISBN = typeof isbn === 'number'

    if( creationStatus ) {
        return isValidTitle && isValidDescription && isValidISBN
    }
    
    const isValidAuthor = typeof author === 'string'   
    const isValidPublisher = typeof publisher === 'string' 
    const isValidTotalQuantity = typeof totalQuantity === 'number'
    const isValidAvailableQuantity = typeof availableQuantity === 'number'
    const isValidPageCount = typeof pages === 'number'
    return isValidTitle && isValidAuthor && isValidDescription 
            && isValidPublisher && isValidISBN && isValidTotalQuantity 
            && isValidAvailableQuantity && isValidPageCount
}

module.exports = {
    isValidBookInfo
}