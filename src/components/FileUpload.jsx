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
  const taskListNames = [];

  for (const taskListName in tasks){
    taskListNames.push(taskListName);
  }

  const selectTask = (name) =>{
    setTaskListContainer((prev) => !prev);
    const taskName = name.toString();
    setActiveTaskList(taskName);
  }

  const handleClick = (name) =>{
    selectTask(name);
  }

  return (
    <div className='flex justify-center gap-1'>
      {console.log(taskListNames)}
      {taskListNames.map((name, idx) => (
        <div className='border-2 rounded-lg p-1 cursor-pointer' onClick={()=>handleClick(name)} key={idx}>{name}</div>
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
    border: file ? "2px solid #00bfff" : "2px dashed #959595",
    padding: "1em",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    height: "30vh",
    width: "50vw",
  };

  return (
    <section id='fileUpload'>
      <div className='dragDropArea'>
        <div 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={dropZoneStyle}>
            {file ? `File: ${file.name}` : 'Drop Files Here'}
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
    </section>
  )
}

export default FileUpload