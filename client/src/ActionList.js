import React, {useState} from 'react'
import axios from 'axios'

const ActionList = ({actions, forceUpdate}) => {
    const markComplete = action => {
        const newAction = 
        {
            completed: !action.completed
        }
        axios
            .put(`http://localhost:8000/api/actions/${action.id}`, newAction)
            .then(res=> {
                forceUpdate()
            })
            .catch(err=> {
                console.log(err)
            })
   }
    return (
        <>
            {!!actions && actions.map(action=> {
                return (
                    <div key={action.id} className='action-card'>
                        <p>Project ID: {action.project_id}</p>
                        <p>Description: {action.description}</p>
                        <p>Notes: {action.notes}</p>
                        <p>Completed: {action.completed ? 'yes' : 'no'}</p>
                        <button onClick={()=>markComplete(action)}>Toggle Completed</button>
                    </div>
                )
            })}
        </>
    )
}

export default ActionList