const express = require("express");
const knex = require("knex");

// database access using knex
const dbConnection = knex({
  client: "sqlite3",
  connection: {
    filename: "./data/posts.db3"
  },
  useNullAsDefault: true
});

const router = express.Router();

//use knex to CRUD data from db using DbConnection

// Read
router.get("/", (req, res) => {
  // use knex to get data from database
  //SQL statement >>>> dbConnection.select('x').from('posts') <<<<<<<<<<<<<<<< shortcut
  dbConnection("posts")
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//Read by ID
router.get("/:id", (req, res) => {
  dbConnection("posts")
    .where({ id: req.params.id })
    .first()
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with that ID could not be found." });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//Create - always pass in a second argument, the id
router.post("/", (req, res) => {
  //SQL statement >>>> insert into post () values ()
  const post = req.body;

  dbConnection("posts")
    .insert(post, "id")
    .then(arrayofIds => {
      const idOfLastRecord = arrayofIds[0];

      res.status(201).json(idOfLastRecord);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//UPDATE by ID
router.put("/:id", (req, res) => {
  const { id } = req.params;

  dbConnection("posts")
    .where({ id: id })
    .update(req.body)
    .then(post => {
      if (post > 0) {
        res.status(200).json({ message: `${post} record(s) updated.` });
      } else {
        res.status(404).json({ message: "The post could not be updated." });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//DELETE by ID
router.delete("/:id", (req, res) => {
  //SQL statement  >>>> delete from posts where id = 14
  dbConnection("posts")
    .where({ id: req.params.id })
    .del()
    .then(post => {
      res.status(200).json({ message: `${post} record(s) deleted.` });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

/// ASYNC + AWAIT

/// >>>>>>>>> POST - CREATE

// router.post("/", async (req, res) => {
//   const post = req.body;
//   try {
//     const insPost = await dbConnection("posts").insert(post);
//     res.status(201).json(insPost[0]);
//   } catch (err) {
//     res.status(500).json(err.message);
//   }
// });

// >>>>>>>>>>> DELETE

// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const count = await db("posts")
//       .where({ id: id })
//       .del();
//     res.status(200).json({ message: `${count} record(s) deleted.` });
//   } catch (err) {
//     res.status(500).json(err.message);
//   }
// });

module.exports = router;
