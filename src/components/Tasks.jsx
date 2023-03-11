import { useState, useEffect } from 'react';
import { app, database } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

const SingleTask = ({item})=>{
  return (
    <div>
      {item}
    </div>
  )
}

const Tasks = ({uid, tasks, setTaskListContainer, activeTaskList, setActiveTaskList}) => {
  //get task names from prop tasks => taskListNames
  const taskListNames = [];
  const [currTasks, setCurrTasks] = useState([]);

  for (const taskListName in tasks){
    taskListNames.push(taskListName);
  }
  //set active tasklist => activeTaskList => manageTasks
  const manageTasks = (i) =>{
    setActiveTaskList(i);
    getCurrTasks(activeTaskList);
  }
  //get tasks from active tasklist => currTasks
  const getCurrTasks = (taskList) =>{
    const list = tasks[taskList];
    //think how to fix this object to be rendered and implement an order to it.
    console.log(list);
    const tasksOnList = [];
    for (const key in list) {
      if (key !== "timestamp") {
        //should I iterate on every atribute to make an array of arrays? 
        //if so, how would i handle the pairs for every field
        //maybe it's easier to keep handling it as an object?
        tasksOnList.push(list[key]);
      }
    }
    console.log(tasksOnList);
    //setCurrTasks(tasksOnList);
  }
  //function to add tasks to active list
  //function to delete tasks from active list
  //function to update tasks from active list => in SingleTask component?
  //function to delete taskList


  return (
    <section id='tasks'>
      <div>
        <div className='taskListNames'>
          <p>hello</p>
          {taskListNames && taskListNames.map((i, idx) =>(
            <div key={idx} onClick={() => manageTasks(i)}>{i}</div>
          ))}
        </div>
        <div className='tasks'>
          {currTasks && (
            currTasks.map((item, idx) => (
              <SingleTask key={idx} item={item} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default Tasks