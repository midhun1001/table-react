import React, { Component } from 'react';
import PropTypes from 'prop-types';
import copy from 'clipboard-copy';
import './index.scss';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: this.props.list ? this.props.list : [],
      headers: this.props.headers ? this.props.headers : [],
      start: false,
      pageno: 1,
      pageCountProp: this.props.pageCount ? this.props.pageCount : 10,
      startcount: 0,
      count: this.props.pageCount ? this.props.pageCount : 10,
      // uploadTable: '',
      // uploadHeader: '',
      msg: 'Loading Table...'
    };
    this.fnExcelReport = () => {
      let csvContent = 'data:text/csv;charset=utf-8,';
      for (let i = 0; i < this.state.headers.length; i += 1) {
        csvContent += `${this.state.headers[i].mapKey},`;
      }
      csvContent += '\r\n';
      for (let j = 0; j < this.state.list.length; j += 1) {
        for (let i = 0; i < this.state.headers.length; i += 1) {
          csvContent += `${this.state.list[j][this.state.headers[i].mapKey]},`;
        }
        csvContent += '\r\n';
      }
      const encodedUri = encodeURI(csvContent);
      window.open(encodedUri);
    };
    this.btnStyles = () => {
      const btnstyles = this.props.btnBg ? this.props.btnBg : '';
      return {
        backgroundColor: btnstyles,
        borderColor: btnstyles
      };
    };
    this.startMultiselect = (e) => {
      if (this.props.csv) {
        if (e.target.parentNode.style.background) {
          e.target.parentNode.style.background = '';
        } else {
          e.target.parentNode.style.background = 'rgba(0, 170, 254, 0.29)';
          this.setState({ start: true });
        }
      }
    };
    this.selectMulti = (e) => {
      if (this.props.csv && this.state.start) {
        e.target.parentNode.style.background = 'rgba(0, 170, 254, 0.29)';
      }
    };
    this.selectRows = () => {
      if (this.props.csv) {
        let copyText = '';
        const rows = document.querySelectorAll('.exl__table tbody tr');
        for (let i = 0; i < rows.length; i += 1) {
          if (rows[i].style.background) {
            if (copyText !== '') {
              copyText += '\r\n';
            }
            for (let j = 0; j < rows[i].childNodes.length; j += 1) {
              copyText += `${rows[i].childNodes[j].innerText}, `;
            }
          }
        }
        copyText = copyText.replace(/,\s*$/, '');
        return copyText;
      }
      return null;
    };
    this.deselect = () => {
      if (this.props.csv) {
        copy(this.selectRows());
        this.setState({ start: false });
      }
    };
    this.toggleAllSelect = (flag) => {
      let copyText = '';
      const rows = document.querySelectorAll('.exl__table tbody tr');
      if (flag === 'clear') {
        for (let i = 0; i < rows.length; i += 1) {
          rows[i].style.background = '';
        }
      } else {
        for (let i = 0; i < rows.length; i += 1) {
          rows[i].style.background = 'rgba(0, 170, 254, 0.29)';
        }
        copyText = this.selectRows();
      }
      copy(copyText);
    };
    this.contentEdit = (e, param, value) => {
      if (this.props.edited) {
        e.persist();
        if (param === 'hide') {
          e.target.contentEditable = false;
          if (e.target.innerText.trim() !== value) {
            const crntRow = e.target.parentNode;
            const editJson = {};
            for (let i = 0; i < crntRow.childNodes.length; i += 1) {
              editJson[crntRow.childNodes[i].getAttribute('mapkey')] = crntRow.childNodes[i].innerText;
            }
            this.props.edited(editJson);
          }
        } else {
          e.target.contentEditable = true;
          setTimeout(() => {
            if (document.activeElement !== e.target) {
              e.target.contentEditable = false;
            }
          }, 300);
        }
      }
    };
    this.renderList = () => (
      this.state.list.map((val, index) => {
        if ((index >= this.state.startcount) && (index < this.state.count)) {
          return (
            <tr
              key={index}
              onMouseDown={this.startMultiselect}
              onMouseOver={this.selectMulti}
              onMouseUp={this.deselect}
            >
              {
                this.state.headers.map((headers, i) => (
                  <td
                    tabIndex="0"
                    key={i}
                    onClick={this.contentEdit}
                    onBlur={(e) => this.contentEdit(e, 'hide', val[headers.mapKey])}
                    mapkey={headers.mapKey}
                  >
                    {val[headers.mapKey]}
                  </td>
                ))
              }
            </tr>
          );
        }
        return null;
      })
    );
    this.changePage = (e, param) => {
      if (param === 'next' && this.state.pageno !== '') {
        if ((this.state.list.length / this.state.pageCountProp) > this.state.pageno) {
          this.setState({
            pageno: parseInt(this.state.pageno, 10) + 1,
            startcount: parseInt(this.state.count, 10),
            count: parseInt(this.state.count, 10) + parseInt(this.state.pageCountProp, 10)
          });
        }
      } else if (param === 'prev' && this.state.pageno !== '') {
        if (this.state.pageno > 1) {
          this.setState({
            pageno: parseInt(this.state.pageno, 10) - 1,
            count: parseInt(this.state.count, 10) - parseInt(this.state.pageCountProp, 10)
          }, () => {
            this.setState({
              startcount: parseInt(this.state.count, 10) - parseInt(this.state.pageCountProp, 10)
            });
          });
        }
      } else {
        if (e.target.value === '') {
          this.setState({ pageno: e.target.value });
        } else if ((e.target.value > 0)
        && e.target.value <= (this.state.list.length / this.state.pageCountProp)) {
          this.setState({
            pageno: e.target.value,
            count: e.target.value * this.state.pageCountProp,
            startcount: (e.target.value * this.state.pageCountProp) - this.state.pageCountProp
          });
        }
      }
    };
    this.checkData = () => {
      setTimeout(() => {
        this.setState({ msg: 'No Data' });
      }, 2000);
    };
    this.upload = (event) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        let rows = '';
        const dataArr = text.split('\n');
        const headerArr = dataArr[0].split(',');
        let header = '<tr>';
        for (let k = 0; k < headerArr.length - 1; k += 1) {
          header += `<th>${headerArr[k]}</th>`;
        }
        header += '</tr>';
        for (let i = 1; i < dataArr.length - 1; i += 1) {
          rows += '<tr>';
          const cols = dataArr[i].split(',');
          for (let j = 0; j < cols.length - 1; j += 1) {
            rows += `<td>${cols[j]}</td>`;
          }
          rows += '</tr>';
        }
        this.setState({ uploadHeader: header, uploadTable: rows });
      };
      reader.readAsText(event.target.files[0]);
    };
  }
  componentDidMount() {
    this.checkData();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.list ? nextProps.list : [],
      headers: nextProps.headers ? nextProps.headers : [],
      start: false,
      pageno: 1,
      pageCountProp: nextProps.pageCount ? nextProps.pageCount : 10,
      startcount: 0,
      count: nextProps.pageCount ? nextProps.pageCount : 10
    });
  }
  render() {
    return (
      <div className="spreadsheet">
        <div>
          {
            this.props.upload &&
            <input type="file" onChange={this.upload} />
          }
          {
            this.props.csv &&
            <div className="spreadsheet__copy">
              <button
                className="csv__export-btn sheet-btn"
                onClick={this.fnExcelReport}
                style={this.btnStyles()}
              >
                Download Full Table as CSV
              </button>
              <button
                onClick={() => this.toggleAllSelect('select')}
                className="select-all sheet-btn"
                style={this.btnStyles()}
              >
                Copy all rows of page
              </button>
              <button
                onClick={() => this.toggleAllSelect('clear')}
                className="de-select sheet-btn"
                style={this.btnStyles()}
              >
                De-select All
              </button>
            </div>
          }
          <div className="spreadsheet__table">
            <div className="spreadsheet__table-dir">
              <button
                className="spreadsheet__table-prev sheet-btn"
                onClick={(e) => this.changePage(e, 'prev')}
                style={this.btnStyles()}
              >
                Prev
              </button>
              <span className="spreadsheet__table-pageno">
                <input type="number" onChange={(e) => this.changePage(e, null)} value={this.state.pageno} />
              </span>
              <button
                className="spreadsheet__table-next sheet-btn"
                onClick={(e) => this.changePage(e, 'next')}
                style={this.btnStyles()}
              >
                Next
              </button>
            </div>
            <table id="exl__table" className="exl__table">
              {
                this.props.upload && (this.state.list.length === 0) &&
                <thead
                  dangerouslySetInnerHTML={{ __html: this.state.uploadHeader }}
                  className={`exl__table-thead ${this.props.theadStyle ? this.props.theadStyle : ''}`}
                />
              }
              {
                this.props.upload && (this.state.list.length === 0) &&
                <tbody
                  dangerouslySetInnerHTML={{ __html: this.state.uploadTable }}
                  className={`exl__table-tbody ${this.props.tbodyStyle ? this.props.tbodyStyle : ''}`}
                />
              }
              {
                !this.props.upload && (this.state.list.length > 0) &&
                <thead className={`exl__table-thead ${this.props.theadStyle ? this.props.theadStyle : ''}`}>
                  <tr>
                    {
                      (this.state.headers.length > 0) &&
                      this.state.headers.map((val, index) => (
                        <th key={index}>{val.headerName}</th>
                      ))
                    }
                  </tr>
                </thead>
              }
              {
                !this.props.upload && (this.state.list.length > 0) &&
                <tbody className={`exl__table-tbody ${this.props.tbodyStyle ? this.props.tbodyStyle : ''}`}>
                  { this.renderList() }
                  {
                    this.state.list.length === 0 &&
                    <tr className="nodata">
                      <td>{this.state.msg}</td>
                    </tr>
                  }
                </tbody>
              }
            </table>
          </div>
          <div className="spreadsheet__table-dir">
            <button
              className="spreadsheet__table-prev sheet-btn"
              onClick={(e) => this.changePage(e, 'prev')}
              style={this.btnStyles()}
            >
              Prev
            </button>
            <span className="spreadsheet__table-pageno">
              <input type="number" onChange={(e) => this.changePage(e, null)} value={this.state.pageno} />
            </span>
            <button
              className="spreadsheet__table-next sheet-btn"
              onClick={(e) => this.changePage(e, 'next')}
              style={this.btnStyles()}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Table.propTypes = {
  list: PropTypes.array,
  headers: PropTypes.array,
  pageCount: PropTypes.number,
  theadStyle: PropTypes.string,
  tbodyStyle: PropTypes.string,
  btnBg: PropTypes.string,
  csv: PropTypes.bool,
  upload: PropTypes.bool,
  edited: PropTypes.func
};

export default Table;
