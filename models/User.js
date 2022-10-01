const mongoose = require("mongoose");
const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return emailRegex.test(v)
      },
      message: (props) => `$(props.value) is not a valid email`,
    },
  },
  thoughts: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thought'
    }
  ],
  friends: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
  ]
},
{
    virtuals: {
        friendCount: {
            get() {
                return this.friends.length
            }
        }
    }
}
);

const User = mongoose.model("User", userSchema);

const handleError = (err) => console.error(err);

User.find({}).exec((err, collection) => {
  if (err) {
    return handleError(err);
  }
  if (collection.length === 0) {
    return User.insertMany([], (insertError) =>
      insertError ? handleError(insertError) : console.log("Inserted")
    );
  }
  return console.log("Already populated");
});

module.exports = User;
