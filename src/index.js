import React, {useState} from "react";
import ReactDOM from "react-dom";
import Dragon  from "./dragon";
import "./styles.css";

function App() {
  const allowedFileType = []
  let allowUpload = true;

  function onFileupload(arg){
    console.log(arg)
  }
  function onFileRemoved(arg){
  }

  return (
    <div className="App">
      <div
        style={{ backgroundColor: "green", height: "250px", width: "250px" }}
      >
        <Dragon onFileupload={onFileupload} allowedFileType={allowedFileType} allowUpload={allowUpload} onFileRemoved={onFileRemoved}/>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
