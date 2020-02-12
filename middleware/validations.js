const isValidId = (req, res, next) => {
    if(!isNaN(req.params.id)) 
        return next()
    return next(new Error('Invalid ID'))
}

module.exports = {
    isValidId
}