import React, {useState, useRef} from "react";
import './dragon.css'

function Dragon(props) {
  const {
         maxFileSize = 1000000,
         onFileRemoved,
         onFileupload,
         allowUpload = true,
         cardText = 'Drag and drop',
         buttonInfo = 'Upload here',
         allowedFileType = [],
        } = props

  const [isUploadAllowed] = useState(allowUpload != null ? allowUpload : true);
  const [isDragging, updateIsDragging] = useState(false);
  const [dragEventCounter, updateDragEventCounter] = useState(0);
  const [currentFile, updateCurrentFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('')
  const [fileUploaded, setFileUploaded] = useState(false)
  const fileInputRef = useRef(null);

  const dragenterListener = event => {
    overrideEventDefaults(event);
    updateDragEventCounter((prevState)=> prevState + 1);
    if (event.dataTransfer.items && event.dataTransfer.items[0]) {
      updateIsDragging(true);
    } else if (
      event.dataTransfer.types &&
      event.dataTransfer.types[0] === 'Files'
    ) { // for IE browser
      updateIsDragging(true);
    }
  };

  const dragleaveListener = event => {
    overrideEventDefaults(event);
    updateDragEventCounter((prevState)=> {
      if (prevState - 1 === 0) {
        updateIsDragging(false);
      }
      return prevState - 1;
    });
  };

  const dropListener = event => {
    overrideEventDefaults(event)
    updateDragEventCounter(0)
    updateIsDragging(false)
    setErrorMessage('')
    if(!isUploadAllowed) return
    let file = event.dataTransfer.files[0];

    if (file) {
      if (currentFile !== null)  {
        setErrorMessage(`only 1 file allowed.`)
        return
      }
      if (file.size < maxFileSize) {
        if(allowedFileType.length === 0 || allowedFileType.includes(event.dataTransfer.files[0].type)){
          updateCurrentFile(prev=> {
            convetToImage(file)
            setFileUploaded(true)
            onFileupload(file)
            return file
          });
        }else {
          setErrorMessage(`File type not allowed`)
        }
      } else {
        setErrorMessage(`File should be below ${maxFileSize} kb.`)
      }
    }
  };

  const overrideEventDefaults = event => {
    event.preventDefault();
  };

  const onSelectFileClick = () => {
    fileInputRef && fileInputRef.current.click();
  };

  const onFileChanged = event => {
    setErrorMessage('')
    if (event.target.files[0]) {
      if (currentFile !== null)  {
        setErrorMessage(`only 1 file allowed.`)
        return
      }
      let file = event.target.files[0];
      if (file && file.size < maxFileSize) {
        updateCurrentFile(prev=> {
          convetToImage(file)
          setFileUploaded(true)
          onFileupload(file)
          return file
        });
      } else {
        setErrorMessage(`File should be below ${maxFileSize} kb.`)
        return
      }
    }
  };

  const removeFile = () =>{
    onFileRemoved()
    setFileUploaded(false)
    updateCurrentFile(null)
  }

  const convetToImage = () => {
    if(currentFile !== null && /^image\//.test((currentFile.type))){
      return URL.createObjectURL(currentFile);
    }
    return false
  };

  return (<>
  {fileUploaded ?
  <div className="containerStyle" style={{position:'relative'}}>
    <div onClick={()=> removeFile()} style={{position:'absolute', top:'-15px', right:'-6px', fontSize:'25px'}}>X</div>
      {convetToImage() ?
      <img src={convetToImage()} style={{height:'100px', width:'100px'}}/>
      :
      <div>File Icon</div>
      }
     <p>{currentFile.name}</p>
  </div>
  :
  <div className="containerStyle"
  style={isDragging ? {backgroundColor:'pink'}:null}
            onDrag={overrideEventDefaults}
            onDragStart={overrideEventDefaults}
            onDragEnd={overrideEventDefaults}
            onDragOver={overrideEventDefaults}
            onDragEnter={dragenterListener}
            onDragLeave={dragleaveListener}
            onDrop={dropListener}
    >
    { isUploadAllowed ?
      <div>
        <p className="textStyle">{cardText}</p>
        <p className="subTextStyle">or</p>
      </div>
      :
      <p>uploading...</p>
    }

    <p style={{color:'red'}}>{errorMessage}</p>

    <div className="ButtonStyle" style={!isUploadAllowed ? {backgroundColor:'#D3D3D3'}:null} onClick={onSelectFileClick} >
      {buttonInfo}
    </div>
    <input  style={{display:'none'}}
            disabled={!isUploadAllowed}
            ref={fileInputRef}
            type="file"
            className="file-uploader__input"
            onChange={onFileChanged}
            accept={allowedFileType}
          />
  </div>
}
  </>);
}
export default Dragon;
