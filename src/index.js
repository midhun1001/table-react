import React, { Component } from 'react';
import PropTypes from 'prop-types';
import copy from 'clipboard-copy';
import Nav from './Nav';
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
      msg: 'Loading Table...',
      csvError: ''
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
            const { list } = this.state;
            list[e.target.parentNode.getAttribute('rowno')] = editJson;
            this.setState({ list }, () => {
              this.props.edited(editJson);
            });
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
              rowno={index}
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
        && e.target.value <= Math.round((this.state.list.length / this.state.pageCountProp))) {
          this.setState({
            pageno: e.target.value,
            count: e.target.value * this.state.pageCountProp,
            startcount: (e.target.value * this.state.pageCountProp) - this.state.pageCountProp
          });
        }
      }
    };
    this.checkData = () => {
      if (this.props.upload && this.state.list.length === 0) {
        this.setState({ csvError: 'Upload CSV File' });
      } else {
        setTimeout(() => {
          this.setState({ msg: 'No Data' });
        }, 2000);
      }
    };
    this.upload = (event) => {
      if (event.target.files[0] && event.target.files[0].type === 'text/csv') {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result;
          const rows = [];
          const dataArr = text.split('\n');
          const headerArr = dataArr[0].split(',');
          const headerObj = [];
          if (dataArr.length <= 5002) {
            for (let k = 0; k < headerArr.length - 1; k += 1) {
              headerObj.push({ headerName: headerArr[k], mapKey: headerArr[k] });
            }
            this.setState({ headers: headerObj }, () => {
              const cols = [];
              for (let i = 1; i < dataArr.length; i += 1) {
                cols.push(dataArr[i].split(','));
              }
              for (let j = 0; j < cols.length; j += 1) {
                const obj = {};
                for (let l = 0; l < this.state.headers.length; l += 1) {
                  obj[this.state.headers[l].mapKey] = cols[j][l];
                }
                rows.push(obj);
              }
              this.setState({ list: rows, csvError: '' });
            });
          } else {
            this.setState({ csvError: 'Maximum count of 5000 rows only allowed' });
          }
        };
        reader.readAsText(event.target.files[0]);
      } else {
        this.setState({ csvError: 'Supports only csv' });
      }
    };
  }
  componentDidMount() {
    this.checkData();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.list ? nextProps.list : []
    });
  }
  render() {
    return (
      <div className="spreadsheet">
        {
          !this.props.upload && this.state.list.length === 0 &&
          <p className="nodata">
            {this.state.msg}
          </p>
        }
        <div>
          <div className="spreadsheet__copy">
            {
              this.props.upload &&
              <div style={{ display: 'inline-block' }}>
                <label
                  htmlFor="file-upload"
                  className="select-all sheet-btn"
                  style={this.btnStyles()}
                >
                    Upload CSV
                </label>
                <input
                  onChange={this.upload}
                  id="file-upload"
                  type="file"
                />
              </div>
            }
            {
              (this.state.list.length > 0 && this.props.csv) &&
              <div style={{ display: 'inline-block' }}>
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
            {
              this.props.upload &&
              <p className="nodata">
                { this.state.csvError }
              </p>
            }
          </div>
          {
            this.state.list.length > 0 &&
            <div>
              <div className="spreadsheet__table">
                <Nav
                  changePage={this.changePage}
                  styles={this.btnStyles()}
                  pageno={this.state.pageno}
                />
                <div className="table__wrapper">
                  <table id="exl__table" className="exl__table">
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
                    <tbody className={`exl__table-tbody ${this.props.tbodyStyle ? this.props.tbodyStyle : ''}`}>
                      { this.renderList() }
                    </tbody>
                  </table>
                </div>
              </div>
              <Nav
                changePage={this.changePage}
                styles={this.btnStyles()}
                pageno={this.state.pageno}
              />
            </div>
          }
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
