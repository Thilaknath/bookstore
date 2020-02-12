const CronJob = require('cron').CronJob

const queries = require('../db/models/book')

const job = new CronJob('* * * * *', async () => {
  const books = await queries.getAll()
  const filteredBooks = books.filter(book => book.availableQuantity === 0 )
  console.table(filteredBooks)
  for(let i = 0; i < filteredBooks.length; i++) {
    const id = filteredBooks[i].bookId
    const book = await queries.getOne(id)
    book.status = 'Out of Stock'
    await queries.update(id, book)
  }

}, null, true, 'America/Los_Angeles')


module.exports = {
    job
}