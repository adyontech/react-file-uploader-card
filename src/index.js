import React from "react";
import ReactDOM from "react-dom";
import Dragon  from "./dragon";
import "./styles.css";

function App() {
  const allowedFileType = ['image/png', 'application/pdf']
  // const maxFileUploads = 5
  let allowUpload = true
  // const textStyle = {fontSize: '15px', color: 'red', }
  // const ButtonStyle = {fontSize: '15px', color: 'white', }
  // const containerStyle = {fontSize: '15px', color: 'red', border:'1px solid pink'}

  function onFileupload(arg){
    console.log(arg)
  }

  return (
    <div className="App">
      <div
        style={{ backgroundColor: "green", height: "250px", width: "250px" }}
      >
        <Dragon onFileupload={onFileupload} allowedFileType={allowedFileType} allowUpload={allowUpload}/>
      </div>
    </div>
  );
}
// textStyle={textStyle}
// ButtonStyle={ButtonStyle} containerStyle={containerStyle}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
