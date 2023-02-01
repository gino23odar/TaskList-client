import { useState } from 'react';

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
  const dropZoneStyle = {
    border: file ? "2px solid #00bfff" : "2px dashed #959595",
    padding: "1em",
    textAlign: "center",
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
          <button onClick={()=>{}}>Extraer</button>
          <button onClick={() => setFile(null)}>Borrar</button>
      </div>
    </section>
  )
}

export default FileUpload