import React from 'react';

const Download = (props) => {
  const readyForDownload = require('./functions').readyForDownload;

  const download = (type) => {
    let downloadData = [];

    switch (type) {
      case 'partial':
        downloadData = [...props.selectedRow];
        break;

      case 'page':
        downloadData = [...props.currentPage];
        break;

      case 'full':
        downloadData = [...props.fullList];
        break;

      default:
        downloadData = [];
        break;
    };

    readyForDownload(type, props.headers, downloadData, props.filename);
  };

  return (
    <ul>
      {
        props.downloadRows &&
        <li className="download">
          <button
            style={props.downloadButtonStyle || {}}
            className={`${props.downloadButtonClass || 'downloadButton'}`}
            onClick={() => download('partial')}
          >
            Download Rows
          </button>
        </li>
      }
      {
        props.downloadPage &&
        <li className="download">
          <button
            style={props.downloadButtonStyle || {}}
            className={`${props.downloadButtonClass || 'downloadButton'}`}
            onClick={(e) => download('page')}
          >
            Download Page
          </button>
        </li>
      }
      {
        props.downloadTable &&
        <li className="download">
          <button
            style={props.downloadButtonStyle || {}}
            className={`${props.downloadButtonClass || 'downloadButton'}`}
            onClick={(e) => download('full')}
          >
            Download Table
          </button>
        </li>
      }
    </ul>
  );
};

export default Download;