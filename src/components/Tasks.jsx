import { useState, useEffect } from 'react';
import { app, database } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ReactComponent as Cog } from '../assets/cog.svg';

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
    <div className="taskListTable table w-full table-fixed border-separate border-spacing-2 border border-slate-600">
      <div className="taskListHeader table-row border border-slate-600">
        {columnKeys.map((columnKey) => (
          <div
            key={columnKey}
            className="table-cell font-bold py-2 px-4"
          >
            {columnKey}
          </div>
        ))}
      </div>
      {currTasks.map((task, index) => (
        <div
          key={index}
          className='table-row'
        >
          {columnKeys.map((columnKey) => (
            <div key={columnKey} className="table-cell py-1 px-4 border">
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
  const taskListNamesAndTimestamp = [];

  for (const taskListName in tasks){
    const timestamp = tasks[taskListName].timestamp;
    taskListNamesAndTimestamp.push([taskListName, timestamp]);
  }

  //some of the older lists have no timestamp so they could cause an 
  //error if we called .toMillis() on the undefined or not set timestamp
  const taskListNames = taskListNamesAndTimestamp.sort((a, b) => {
    const timestampA = a[1];
    const timestampB = b[1];
    if (timestampA && timestampB) {
      return timestampA.toMillis() - timestampB.toMillis();
    } else if (timestampA) {
      return -1;
    } else {
      return 1;
    }
  }).map((taskList) => {
    return taskList[0];
  });
  //set active tasklist => activeTaskList => manageTasks
  const manageTasks = (i) =>{
    setActiveTaskList(i);
  }

  //function to add tasks to active list
  //function to delete tasks from active list
  //function to update tasks from active list => in SingleTask component?
  //function to delete taskList


  return (
    <section id='tasks'>
      <div>
        <div className='grid grid-cols-5 pt-6'>
          <h1 className='latoFont text-3xl font-black pl-6'>Tus Listas:</h1>
          <div className='col-span-4 flex justify-start pb-4 pl-6 pr-12 gap-2'>
            {taskListNames && taskListNames.map((i, idx) =>(
              <div className='border-2 rounded-md p-2' key={idx} onClick={() => manageTasks(i)}>{i}</div>
            ))}
          </div>
        </div>
        <div className='flex flex-col'>
          <hr className='border-black border-1'/>
          <div className='flex items-center'>
            <Cog />
            {activeTaskList? (
              <div className='font-bold text-4xl pb-2'>
                {activeTaskList}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className='tasks'>
          {activeTaskList ? (
            <TaskDisplay tasks={tasks} activeTaskList={activeTaskList} />
          ) : (
            <div> NO TASKSLIST CHOSEN </div>
          )}
        </div>
      </div>
      {/* try to add to footer to render conditionally on setTaskListContainer */}
      <button onClick={()=>{if(setTaskListContainer) setTaskListContainer(prev => !prev)}}>Inicio</button>
    </section>
  )
}

export default Tasks