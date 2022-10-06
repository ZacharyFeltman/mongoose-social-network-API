const express = require("express");
const db = require("./config/connection");

const { User, Thought } = require("./models");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.get("/api/users", (req, res) => {
  User.find({}, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      console.log("Uh Oh, something went wrong");
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

app.get("/api/users/:id", (req, res) => {
  User.findOne({ _id: req.params.id }, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      console.log("Uh Oh, something went wrong");
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

app.post("/api/users", (req, res) => {
  const newUser = new User(req.body);
  newUser.save();
  if (newUser) {
    res.status(201).json(newUser);
  } else {
    console.log("Uh Oh, something went wrong");
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.put("/api/users/:id", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true },
    (err, result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        console.log("Uh Oh, something went wrong");
        res.status(500).json({ error: "Something went wrong" });
      }
    }
  );
});

app.delete("/api/users/:id", (req, res) => {
  User.findOneAndDelete({ _id: req.params.id }, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      console.log("Uh Oh, something went wrong");
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

app.post("/api/users/:userId/friends/:friendId", (req, res) => {
  User.findOne({ _id: req.params.userId }, (err, user) => {
    if (user) {
      user.friends.push(req.params.friendId);
      user.save();
      res.status(200).json(user);
    } else {
      console.log("Uh Oh, something went wrong");
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

app.delete("/api/users/:userId/friends/:friendId", (req, res) => {
  User.findOne({ _id: req.params.userId }, (err, user) => {
    if (user) {
      let removeIndex = null;
      for (let i = 0; i < user.friends.length; i++) {
        let friend = user.friends[i];
        console.log(friend._id)
        if (friend._id == req.params.friendId) removeIndex = i;
      }
      console.log(removeIndex)
      if (removeIndex !== null) {
        console.log('here')
        var newFriends = null
        if (user.friends.length === 1) {
          newFriends = []
        } else {
          newFriends = user.friends.splice(removeIndex-1, 1);
        }
        console.log(newFriends)
        user.friends = newFriends
      }
      user.save();
      res.status(200).json(user);
    } else {
      console.log("Uh Oh, something went wrong");
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

app.get("/api/thoughts", (req, res) => {
  Thought.find({}, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      console.log("Uh Oh, something went wrong");
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

app.get("/api/thoughts/:id", (req, res) => {
  Thought.findOne({ _id: req.params.id }, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      console.log("Uh Oh, something went wrong");
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

app.post("/api/thoughts", (req, res) => {
  const newThought = new Thought(req.body);
  newThought.save();
  if (newThought) {
    User.findOne({ username: newThought.username }, (err, user) => {
      user.thoughts.push(newThought.id);
      user.save();
    });
    res.status(201).json(newThought);
  } else {
    console.log("Uh Oh, something went wrong");
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.put("/api/thoughts/:id", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true },
    (err, result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        console.log("Uh Oh, something went wrong");
        res.status(500).json({ error: "Something went wrong" });
      }
    }
  );
});

app.delete("/api/thoughts/:id", (req, res) => {
  Thought.findOneAndDelete({ _id: req.params.id }, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      console.log("Uh Oh, something went wrong");
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

app.post("/api/thoughts/:id/reactions", (req, res) => {
  Thought.findOne({ _id: req.params.id }, (err, thought) => {
    if (thought) {
      thought.reactions.push(req.body);
      thought.save();
      res.status(200).json(thought);
    } else {
      console.log("Uh Oh, something went wrong");
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

app.delete("/api/thoughts/:id/reactions/:reactionId", (req, res) => {
  Thought.findOne({ _id: req.params.id }, (err, thought) => {
    if (thought) {
      let removeIndex = null;
      for (let i = 0; i < thought.reactions.length; i++) {
        let reaction = thought.reactions[i];
        if (reaction.reactionId == req.params.reactionId) removeIndex = i;
      }
      if (removeIndex !== null) {
        var newReactions = null
        if (thought.reactions.length === 1) {
          newReactions = []
        } else {
          newReactions = thought.reactions.splice(removeIndex-1, 1);
        }
        thought.reactions = newReactions
      }
      thought.save();
      res.status(200).json(thought);
    } else {
      console.log("Uh Oh, something went wrong");
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
