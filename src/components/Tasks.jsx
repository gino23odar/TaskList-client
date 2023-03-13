import { useState, useEffect } from 'react';
import { app, database } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

const TaskDisplay = ({tasks, activeTaskList})=>{
  const list = tasks[activeTaskList];
  const currTasks = [];
  for(const key in list){
    if(key !== "timestamp"){
      currTasks.push(list[key]);
    }
  }

  let columnKeys = Object.keys(currTasks[1]);
  
  return (
    <div>
      <div style={{ display: 'flex' }}>
        {columnKeys.map((columnKey) => (
          <div key={columnKey}>
            {columnKey}
          </div>
        ))}
      </div>
      {/* add drag and options buttons to this divs */}
      {currTasks.map((task) => (
        <div style={{ display: 'flex' }} key={task.id}>
          {columnKeys.map((columnKey) => (
            <div key={columnKey}>
              {task[columnKey]}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const Tasks = ({uid, tasks, setTaskListContainer, activeTaskList, setActiveTaskList}) => {
  //get task names from prop tasks => taskListNames
  const taskListNames = [];

  for (const taskListName in tasks){
    taskListNames.push(taskListName);
  }
  //set active tasklist => activeTaskList => manageTasks
  const manageTasks = (i) =>{
    setActiveTaskList(i);
  }
  // //get tasks from active tasklist => currTasks
  // const getCurrTasks = (taskList) =>{
  //   const list = tasks[taskList];
  //   //think how to fix this object to be rendered and implement an order to it.
  //   console.log(list);
  //   const tasksOnList = [];
  //   for (const key in list) {
  //     if (key !== "timestamp") {
  //       //should I iterate on every atribute to make an array of arrays? 
  //       //if so, how would i handle the pairs for every field
  //       //maybe it's easier to keep handling it as an object?
  //       tasksOnList.push(list[key]);
  //     }
  //   }
  //   console.log(Object.keys(tasksOnList[1]));
  //   setCurrTasks(tasksOnList);
  // }
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
          <TaskDisplay tasks={tasks} activeTaskList={activeTaskList} />
        </div>
      </div>
    </section>
  )
}

export default Tasks