import { useState } from 'react';
import {read} from 'xlsx';
import { app, database } from '../firebaseConfig';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

function extractDataFromExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const headers = {};
      const rows = [];

      // Extract the headers and rows from the worksheet
      for (let cell in worksheet) {
        if (cell[0] === "!") continue;
        const col = cell.substring(0, 1);
        const row = parseInt(cell.substring(1));
        const value = worksheet[cell].v;
        if (row === 1) {
          headers[col] = value;
        } else {
          if (!rows[row]) rows[row] = {};
          if (!value) continue;
          rows[row][headers[col]] = value;
        }
      }

      // Remove the first row (headers)
      rows.shift();

      // Log the extracted data to the console
      console.log(rows);

      resolve(rows);
    };

    reader.onerror = (event) => {
      reject(event.target.error);
    };

    reader.readAsArrayBuffer(file);
  });
}

//could I make this a separate component to use here and in Tasks.jsx?
const TaskListNames = ({ tasks, setTaskListContainer, setActiveTaskList }) => {
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

  const selectTask = (name) =>{
    const taskName = name.toString();
    setActiveTaskList(taskName);
    setTaskListContainer((prev) => !prev);
  }

  const handleClick = (name) =>{
    selectTask(name);
  }

  return (
    <div className='flex justify-center gap-1 pb-6'>
      {console.log(taskListNames)}
      {taskListNames.map((name, idx) => (
        <div className='border-2 rounded-lg p-1 cursor-pointer bg-white text-2xl' onClick={()=>handleClick(name)} key={idx}>{name}</div>
      ))}
    </div>
  );
};


const FileUpload = ({ uid, tasks, setTaskListContainer, setActiveTaskList }) => {
  const [file, setFile] = useState(null);
  const handleDrop = (e) =>{
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
      setFile(file);
    } else {
      alert("Tipo de archivo invalido. Este sistema solo acepta archivos Excel.");
    }
  }
  const handleDragOver = (e) =>{
    e.preventDefault();
  }

  const addTasks = async (tasks, uid, taskListName) => {
    const usersRef = collection(database, "users");
    const userDocRef = doc(usersRef, uid);
  
    // Set the document with the array of tasks under a task list
    await setDoc(userDocRef, {
      taskLists: {
        [taskListName]: { 
          ...tasks,
          timestamp: serverTimestamp()
        }
      }
    }, { merge: true });
  };

  const handleExtract = async () => {
    if(!file) return;
    const rows = await extractDataFromExcelFile(file);
    //console.log(rows);
    const fileName = file.name.split('.')[0];
    console.log(fileName);
    await addTasks(rows, uid, fileName);
  }

  const dropZoneStyle = {
    display: "flex",
    border: file ? "2px solid #00bfff" : "6px dashed #000000",
    padding: "1em",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    height: "30vh",
    width: "50vw",
    backgroundColor: file ? "rgba(4, 33, 121, 0.9)" : "rgba(149, 149, 149, 0.1)",
  };

  return (
    <section id='fileUpload' className='patternBackground'>
      <div className='warningBarsCont'>
        <div className='warningBar'></div>
      </div>
      <div className='dragDropArea'>
        <div 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={dropZoneStyle}>
            <div className='bg-white/[.8] font-extrabold text-4xl rounded-3xl p-2'>
              {file ? `File: ${file.name}` : 'Suelta tus archivos aqui'}
            </div>
        </div>
      </div>
      <div className='dragButtons'>
          <button onClick={handleExtract}>Extraer</button>
          <button onClick={() => setFile(null)}>Borrar</button>
      </div>
      <TaskListNames 
        tasks={tasks}
        setTaskListContainer={setTaskListContainer}
        setActiveTaskList={setActiveTaskList}
      />
      <div className='warningBarsCont'>
        <div className='warningBar'></div>
      </div>
    </section>
  )
}

export default FileUpload