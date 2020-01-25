const express = require('express');
const db = require('../data/helpers/projectModel')

const router = express.Router();
router.use(express.json()) 

router.get('/', (req, res) => {
  db.get()
    .then(projects=> {
      res.status(200).json(projects)
    })
    .catch(err=> {
      res.status(400).json({error: 'could not retrieve projects'})
    })
});

router.get('/:id', validateProjectId,(req, res) => {
  const {id} = req.params
  db.get(id)
    .then(project=> {
      res.status(200).json(project)
    })
    .catch(err=> {
      res.status(500).json({error: `could not retrieve project at id ${id}`})
    })
});

router.get('/:id/actions', validateProjectId, (req, res) => {
    const {id} = req.params
    db.get(id)
        .then(project=> {
            res.status(200).json(project.actions)
        })
        .catch(err=> {
            res.status(500).json({error: `could not retrieve project at id ${id}`})
        })
})

router.post('/', validateNewProject,(req, res) => {
    const body = req.body
    db.insert(body)
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err=> {
            res.status(500).json({ error: 'could not insert new project'})
        })
})

router.delete('/:id', validateProjectId,(req, res) => {
  const {id} = req.params

  db.get(id)
    .then( project=> 
      db.remove(id)
        .then(del => {
          if(del===1){
            res.status(200).json(project)
          }
          else {
            res.status(400).json({error: 'nothing deleted'})
          }
          
        })
        .catch(err=> {
          res.status(500).json({error: `could not delete project ${id}`})
        })
    )
    .catch(err=> {
      res.status(500).json({error: `server error`})
    })
 
});

router.put('/:id', validateProjectId,(req, res) => {
  const {id} = req.params
  const changes = req.body
  db.update(id, changes)
    .then(project=> {
        if(project)
            res.status(200).json(project)
        else    
            res.status(400).json({error: 'invalid id'})
    })
    .catch(err=> {
      res.status(500).json({error: `could not update project ${id}`})
    })
});

// custom middleware

function validateProjectId(req, res, next) {
  const { id } = req.params;
  db.get(id)
    .then(project => {
      if (project) {
        next();
      } else {
        res.status(400).json({ message: "invalid project id" });
        // next(new Error("invalid user id" );
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'exception', err });
    });
}
function validateNewProject(req, res, next) {
    const body = req.body
    if(body.name && body.description)
        next()
    else 
        res.status(400).json({ error: 'New project must include the following fields: name, description.'})
}

module.exports = router;
