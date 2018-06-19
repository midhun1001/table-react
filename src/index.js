import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import copy from 'clipboard-copy';
import './index.scss';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: this.props.list ? this.props.list : [],
      headers: this.props.headers ? this.props.headers : [],
      alert: false,
      start: false,
      pageno: 1,
      pageCountProp: this.props.pageCount ? this.props.pageCount : 10,
      startcount: 0,
      count: this.props.pageCount ? this.props.pageCount : 10
    };
    this.alertRef = React.createRef();
    this.hideAlert = () => {
      let i = 1;
      const alertFade = setInterval(() => {
        i -= 0.1;
        if (i < 0) {
          clearInterval(alertFade);
          this.setState({ alert: false });
        }
      }, 100);
    };
    this.startMultiselect = (e) => {
      if (e.target.parentNode.style.background) {
        e.target.parentNode.style.background = '';
      } else {
        e.target.parentNode.style.background = 'rgba(0, 170, 254, 0.29)';
        this.setState({ start: true });
      }
    };
    this.selectMulti = (e) => {
      if (this.state.start) {
        e.target.parentNode.style.background = 'rgba(0, 170, 254, 0.29)';
      }
    };
    this.selectRows = () => {
      let copyText = '';
      const rows = document.querySelectorAll('.exl__table tbody tr');
      for (let i = 0; i < rows.length; i += 1) {
        if (rows[i].style.background) {
          if (copyText !== '') {
            copyText += '\n';
          }
          for (let j = 0; j < rows[i].childNodes.length; j += 1) {
            copyText += `${rows[i].childNodes[j].innerText}, `;
          }
        }
      }
      copyText = copyText.replace(/,\s*$/, '');
      return copyText;
    };
    this.deselect = () => {
      copy(this.selectRows());
      this.setState({ alert: true, start: false });
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
                  <td key={i}>{val[headers.mapKey]}</td>
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
  }
  render() {
    return (
      <div className="spreadsheet">
        <div className="spreadsheet__copy">
          <button onClick={() => this.toggleAllSelect('select')} className="select-all">Copy all rows of page</button>
          <button onClick={() => this.toggleAllSelect('clear')} className="de-select">De-select All</button>
        </div>
        <div className="spreadsheet__table">
          <div className="spreadsheet__table-dir">
            <button className="spreadsheet__table-prev" onClick={(e) => this.changePage(e, 'prev')}>Prev</button>
            <span className="spreadsheet__table-pageno">
              <input type="number" onChange={(e) => this.changePage(e, null)} value={this.state.pageno} />
            </span>
            <button className="spreadsheet__table-next" onClick={(e) => this.changePage(e, 'next')}>Next</button>
          </div>
          {
            this.state.list.length > 0 &&
            <table className="exl__table">
              <thead>
                <tr>
                  {
                    (this.state.headers.length > 0) &&
                    this.state.headers.map((val, index) => (
                      <th key={index}>{val.headerName}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                { this.renderList() }
              </tbody>
            </table>
          }
          {
            this.state.list.length === 0 &&
            <p className="nodata">No Data</p>
          }
        </div>
        {
          this.state.alert &&
          <div ref={this.alertRef} className="alert">
            <div className="alert__box">
              <div className="alert__msg">
                Text copied to clipboard as comma seperated data
              </div>
            </div>
            { this.hideAlert() }
          </div>
        }
        <div className="spreadsheet__table-dir">
          <button className="spreadsheet__table-prev" onClick={(e) => this.changePage(e, 'prev')}>Prev</button>
          <span className="spreadsheet__table-pageno">
            <input type="number" onChange={(e) => this.changePage(e, null)} value={this.state.pageno} />
          </span>
          <button className="spreadsheet__table-next" onClick={(e) => this.changePage(e, 'next')}>Next</button>
        </div>
      </div>
    );
  }
}

Table.propTypes = {
  list: PropTypes.array,
  headers: PropTypes.array,
  pageCount: PropTypes.number
};

axios.get('https://jsonplaceholder.typicode.com/photos')
  .then((response) => {
    if (response.data) {
      ReactDOM.render(
        <Table />,
        document.getElementById('index'),
      );
    }
  });
