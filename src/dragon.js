import React, {useState, useEffect} from "react";
import './dragon.css'
function Dragon(props) {
  let fileUploaderInput = null;
  const {maxFileUploads = 5,
         maxFileSize = 1000000,
         onFileupload,
         allowUpload = true,
         cardText = 'Drag and drop',
         buttonInfo = 'Upload here',
         allowedFileType = []
        } = props

  const [isUploadAllowed] = useState(allowUpload != null ? allowUpload : true);
  const [currentFile, updateCurrentFile] = useState(null);
  const [isDragging, updateIsDragging] = useState(false);
  const [dragEventCounter, updateDragEventCounter] = useState(0);
  const [currentFiles, updateCurrentFiles] = useState([]);
  // const fileUploaderRef = useRef(initialValue)

  const dragenterListener = event => {
    overrideEventDefaults(event);
    updateDragEventCounter((prevState)=> prevState + 1);
    if (event.dataTransfer.items && event.dataTransfer.items[0]) {
      updateIsDragging(true);
    } else if (
      event.dataTransfer.types &&
      event.dataTransfer.types[0] === 'Files'
    ) {
      // This block handles support for IE - if you're not worried about
      // that, you can omit this
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
    overrideEventDefaults(event);
    updateDragEventCounter(0)
    updateIsDragging(false);
    if(!isUploadAllowed) return
    if (event.dataTransfer.files) {
      console.log(event.dataTransfer.files)
      const ArrayLength = event.dataTransfer.files.length;
      if (ArrayLength + currentFiles.length > maxFileUploads) {
        // display error message.
        return
      };
      for (let index = 0; index < ArrayLength; index++) {
        let file = event.dataTransfer.files[index];
        if (file && file.size < maxFileSize && allowedFileType.includes(event.dataTransfer.files[0].type)) {
          updateCurrentFiles(prevState => [...prevState, file]);
        }
      }
    }
  };

  const overrideEventDefaults = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onSelectFileClick = () => {
    fileUploaderInput && fileUploaderInput.click();
  };

  const onFileChanged = event => {
    if (event.target.files) {
      const ArrayLength = event.target.files.length;
      if (ArrayLength + currentFiles.length > maxFileUploads)  {
        // display error message.
        return
      }
      for (let index = 0; index < ArrayLength; index++) {
        let file = event.target.files[index];
        if (file && file.size < maxFileSize) {
          updateCurrentFiles(prevState => [...prevState, file]);
        }
      }
    }
    //   props.onFileupload(event.target.files[0])
  };

  const onRemoveElem = index => {
    updateCurrentFile(null);
  };

  return <div className="containerStyle"
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
    {(currentFile === null) ?
    <div className="ButtonStyle" style={!isUploadAllowed ? {backgroundColor:'#D3D3D3'}:null} onClick={onSelectFileClick}>{buttonInfo}</div>
    :
    <div className="ButtonStyle" onClick={onRemoveElem}>Remove item</div>
    }
    <input  style={{display:'none'}}
            disabled={!isUploadAllowed}
            ref={el => (fileUploaderInput = el)}
            type="file"
            multiple
            className="file-uploader__input"
            onChange={onFileChanged}
            accept={allowedFileType}
          />

  </div>;
}
export default Dragon;
