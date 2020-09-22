import React, { Fragment } from 'react';

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
        downloadData = [...props.list];
        break;

      default:
        downloadData = [];
        break;
    };

    readyForDownload(type, props.headers, downloadData);
  };

  return (
    <Fragment>
      {
        props.downloadRows &&
        <li className="download">
          <button onClick={() => download('partial')}>
            Download Selected Rows hello
            </button>
        </li>
      }
      {
        props.downloadPage &&
        <li className="download">
          <button onClick={(e) => download('page')}>
            Download Page
            </button>
        </li>
      }
      {
        props.downloadTable &&
        <li className="download">
          <button onClick={(e) => download('full')}>
            Download Table
            </button>
        </li>
      }
    </Fragment>
  );
};

export default Download;