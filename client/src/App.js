import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios'
import ProjectList from "./ProjectList"

function App() {
  const [update, setUpdate] = useState(false)
  const [projectList, setProjectList] = useState([])

  useEffect(()=> {
    getProjects()
  }, [update])

  const forceUpdate = ()=> {
    setUpdate(!update)
  }
  const getProjects = ()=> {
    axios
      .get('http://localhost:8000/api/projects')
      .then(res=> {
        setProjectList(res.data)
      })
      .catch(err=> console.log(err))
  }
  return (
    <div className="App">
      <h1>Lambda Project Scheme</h1>
      <ProjectList projectList={projectList} forceUpdate={forceUpdate}/>
    </div>
  );
}

export default App;
