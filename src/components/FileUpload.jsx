import { useState } from 'react';
import {read} from 'xlsx';

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


const FileUpload = () => {
  const [file, setFile] = useState(null);
  const handleDrop = (e) =>{
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
      setFile(file);
    } else {
      alert("Invalid file type. Only Excel files are accepted.");
    }
  }
  const handleDragOver = (e) =>{
    e.preventDefault();
  }

  const handleExtract = async () => {
    const rows = await extractDataFromExcelFile(file);
    console.log(rows);
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
      {console.log(file)}
    </section>
  )
}

export default FileUpload