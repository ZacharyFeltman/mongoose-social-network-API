const mongoose = require ('mongoose')

const reactionSchema = new mongoose.Schema({
    reactionId: { type: ObjectId, default: new mongoose.Types.ObjectId()},
    reactionBody: { type: String, required: true, maxLength: 280},
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now}
})

const thoughtSchema = new mongoose.Schema({
    thoughtText: { type: String, required: true, minLength: 1, maxLength: 280},
    createdAt: {type: Date, default: Date.now, get: v => v.toLocaleString() },
    username: { type: String, required: true},
    reactions: 
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