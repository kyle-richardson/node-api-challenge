const express = require('express');
const db = require('../data/helpers/actionModel')
const projectDb = require('../data/helpers/projectModel')

const router = express.Router();
router.use(express.json()) 

router.get('/', (req, res) => {
  db.get()
    .then(actions=> {
      res.status(200).json(actions)
    })
    .catch(err=> {
      res.status(400).json({error: 'could not retrieve actions'})
    })
});

router.get('/:id', validateActionId,(req, res) => {
  const {id} = req.params
  db.get(id)
    .then(action=> {
      res.status(200).json(action)
    })
    .catch(err=> {
      res.status(500).json({error: `could not retrieve action at id ${id}`})
    })
});

router.post('/', validateNewAction,(req, res) => {
    const body = req.body
    db.insert(body)
        .then(action => {
            res.status(200).json(action)
        })
        .catch(err=> {
            res.status(500).json({ error: 'could not insert new action'})
        })
})

router.delete('/:id', validateActionId,(req, res) => {
  const {id} = req.params

  db.get(id)
    .then( action=> 
      db.remove(id)
        .then(del => {
          if(del===1){
            res.status(200).json(action)
          }
          else {
            res.status(400).json({error: 'nothing deleted'})
          }
          
        })
        .catch(err=> {
          res.status(500).json({error: `could not delete action ${id}`})
        })
    )
    .catch(err=> {
      res.status(500).json({error: `server error`})
    })
 
});

router.put('/:id', validateActionId,(req, res) => {
  const {id} = req.params
  const changes = req.body
  db.update(id, changes)
    .then(action => {
        if(action)
            res.status(200).json(action)
        else
            res.status(400).json({error: 'invalid action id'})
      
    })
    .catch(err=> {
      res.status(500).json({error: `could not update action ${id}`})
    })
});

// custom middleware

function validateActionId(req, res, next) {
  const { id } = req.params;
  db.get(id)
    .then(action => {
      if (action) {
        next();
      } else {
        res.status(400).json({ error: "invalid action id" });
        // next(new Error("invalid user id" );
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'exception', err });
    });
}

function validateNewAction(req, res, next) {
    const body = req.body
    if(body.project_id && body.description && body.notes) {
        projectDb.get(body.project_id)
            .then(project=> {
                if(project)
                    next()
                else
                    res.status(400).json({error: `Project at specified id of ${body.project_id} does not exist`})
            })
            .catch(err => {
                res.status(500).json({error: 'could not add action. server error'})
            })
    }
        
    else 
        res.status(400).json({ error: 'New action must include the following fields: project_id, description, notes.'})
}

module.exports = router;
