const { Schema, model } = require("mongoose");
const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return emailRegex.test(v);
        },
        message: (props) => `$(props.value) is not a valid email`,
      },
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    virtuals: {
      friendCount: {
        get() {
          return this.friends.length;
        },
      },
    },
  }
);

const User = model("User", userSchema);

const handleError = (err) => console.error(err);
const userSeedData = [
  {
    username: 'Zach',
    email: 'zach@email.com',
    thoughts: [],
    friends: []
  },
  {
    username: 'ross',
    email: 'ross@email.com',
    thoughts: [],
    friends: []
  },
  {
    username: 'steph',
    email: 'steph@email.com',
    thoughts: [],
    friends: []
  },
]


User.find({}).exec((err, collection) => {
  if (err) {
    return handleError(err);
  }
  if (collection.length === 0) {
    return User.insertMany(userSeedData, (insertError) =>
      insertError ? handleError(insertError) : console.log("Inserted")
    );
  }
  return console.log("Already populated");
});

module.exports = User;
