const { Schema, model, Types } = require ('mongoose')

const reactionSchema = new Schema({
    reactionId: { type: Types.ObjectId, default: () => new Types.ObjectId() },
    reactionBody: { type: String, required: true, maxLength: 280},
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now}
})

const thoughtSchema = new Schema({
    thoughtText: { type: String, required: true, minLength: 1, maxLength: 280},
    createdAt: {type: Date, default: Date.now, get: v => v.toLocaleString() },
    username: { type: String, required: true},
    reactions: [reactionSchema],
},
{
    virtuals: {
      reactionCount: {
        get() {
          return this.reactions.length;
        },
      },
    },
  }
)

const Thought = model('Thought', thoughtSchema)

const handleError = (err) => console.error(err);

const thoughtSeedData = [
  {
    thoughtText: 'thought1',
    createdAt: Date.now(),
    username: 'Zach',
    reactions: []
  },
  {
    thoughtText: 'thought2',
    createdAt: Date.now(),
    username: 'ross',
    reactions: []
  },
  {
    thoughtText: 'thought3',
    createdAt: Date.now(),
    username: 'steph',
    reactions: []
  },
]

Thought.find({}).exec((err, collection) => {
    if (err) {
      return handleError(err);
    }
    if (collection.length === 0) {
        return Thought.insertMany(
          thoughtSeedData,
            (insertError) =>
                insertError ? handleError(insertError) : console.log('Inserted')
        )
    }
    return console.log('Already populated');
})

module.exports = Thought;