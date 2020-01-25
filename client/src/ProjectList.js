import React, {useState} from 'react'
import axios from 'axios'
import ActionList from './ActionList'

const ProjectList = ({projectList, forceUpdate}) => {
    const [shownActionsId, setShownActionsId] = useState('')
    const [actionList, setActionList] = useState([])
    const showActions = (id)=> {
        axios
            .get(`http://localhost:8000/api/projects/${id}/actions`)
            .then(actions=> {
                setActionList(actions.data)
                setShownActionsId(id)
            })
            .catch(err=> console.log(err))
    }
    const hideActions = ()=> {
        setActionList([])
        setShownActionsId('')
    }

    return (
        <>
            {!!projectList && projectList.map(project=> {
                return (
                    <div key= {project.id} className='project-card'>
                        <p>Name: {project.name}</p>
                        <p>Description: {project.description}</p>
                        <button 
                            onClick= {
                                shownActionsId!==project.id ? 
                                ()=>showActions(project.id): 
                                hideActions
                                }
                        >
                            {shownActionsId!==project.id ? `Show Actions` : `Hide Actions`}
                        </button>
                        {!!actionList && shownActionsId===project.id && <ActionList actions = {actionList} forceUpdate={forceUpdate}/>}
                    </div>
                )
            })}
        </>
    )
}

export default ProjectList