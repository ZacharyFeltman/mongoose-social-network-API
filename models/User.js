const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({

})

const User = mongoose.model('User', userSchema)

const handleError = (err) => console.error(err);

User.find({}).exec((err, collection) => {
    if (err) {
      return handleError(err);
    }
    if (collection.length === 0) {
        return User.insertMany(
            [

            ],
            (insertError) =>
                insertError ? handleError(insertError) : console.log('Inserted')
        )
    }
    return console.log('Already populated');
})

module.exports = User;