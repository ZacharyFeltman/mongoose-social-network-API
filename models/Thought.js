const mongoose = require ('mongoose')

const thoughtSchema = new mongoose.Schema({

})

const Thought = mongoose.model('Thought', thoughtSchema)

const handleError = (err) => console.error(err);

Thought.find({}).exec((err, collection) => {
    if (err) {
      return handleError(err);
    }
    if (collection.length === 0) {
        return Thought.insertMany(
            [

            ],
            (insertError) =>
                insertError ? handleError(insertError) : console.log('Inserted')
        )
    }
    return console.log('Already populated');
})

module.exports = Thought;