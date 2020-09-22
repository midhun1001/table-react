import { AsyncParser } from 'json2csv';

export const readyForDownload = (type, headers, data) => {
  const fields = headers.map((key) => (
    {
      label: key['headerName'],
      value: key['mapKey'],
      default: 'NULL'
    }
  ));
  const opts = {
    fields,
    excelStrings: true,
  };

  const transformOpts = { highWaterMark: 8192 };
  const asyncParser = new AsyncParser(opts, transformOpts);
  let csv = '';

  asyncParser.processor
    .on('data', chunk => (csv += chunk.toString()))
    .on('end', () => downloadFile(csv))
    .on('error', err => console.error(err));

  asyncParser.input.push(JSON.stringify(data));
  asyncParser.input.push(null);
};

const downloadFile = (csv) => {
  const exportedFilenmae = 'export.csv';
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    const link = document.createElement("a");

    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};