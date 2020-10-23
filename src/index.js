import React, { PureComponent } from 'react';
import _property from 'lodash.property';
import _map from 'lodash.map';
import Download from './download';
import './styles.scss';

const PageNo = (props) => (
  <li className="pageNoLi">
    <button
      className={`pageNoBtn ${props.pageNo === props.currentPageNo ? 'activePageNo' : ''}`}
      onClick={() => props.callBack ? props.callBack(props.pageNo) : ''}
    >
      {props.pageNo}
    </button>
  </li>
);

class Table extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      perPage: this.props.pageCount || 10,
      prevPageLimit: 0,
      totalPages: 0,
      currentPageLimit: 1,
      currentPage: [],
      currentPageNo: 1,
      selectedRow: [],
      goToPage: 1,
      list: [],
      sortCode: '',
      loading: false
    };

    this.setPageNo = this.setPageNo.bind(this);
  }

  componentDidMount() {
    const totalPages = Math.ceil(this.state.list.length / this.state.perPage);

    this.setState({ totalPages }, () => {
      this.setCurrentPage();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.list !== this.props.list) {
      this.setState({ list: this.props.list }, () => {
        this.setCurrentPage();
      });
    }
    if ((prevState.prevPageLimit !== this.state.prevPageLimit)
      || (prevState.perPage !== this.state.perPage)) {
      this.setCurrentPage();
    }

    if (prevProps.loading === this.props.loading) {
      this.setState({ loading: this.props.loading });
    }
  }

  setCurrentPage() {
    let list = [...this.state.list];
    const currentPage = list.splice(this.state.prevPageLimit, this.state.perPage);
    const totalPages = Math.ceil(this.state.list.length / this.state.perPage);

    this.setState({ currentPage, totalPages });
  }

  sortTable() {
    this.setState({ loading: true }, () => {
      const list = [...this.props.list];

      list.sort((a, b) => {

        if (typeof b[this.state.sortCode] === 'string' || typeof a[this.state.sortCode] === 'string') {
          if (b[this.state.sortCode] > a[this.state.sortCode]) {
            return -1
          }

          if (b[this.state.sortCode] < a[this.state.sortCode]) {
            return 1
          }

          return 0;
        } else if (typeof b[this.state.sortCode] === 'number' || typeof a[this.state.sortCode] === 'number') {

          return b[this.state.sortCode] - a[this.state.sortCode];
        }

        return 0;
      });
      this.setState({ list, loading: false }, () => {
        this.setCurrentPage();
      });
    });
  }

  setSortOrder(field) {
    if (this.state.sortCode !== field) {
      this.setState({
        sortCode: field,
        prevPageLimit: 0,
        currentPageLimit: 1,
        currentPageNo: 1,
        goToPage: 1,
      }, () => {
        this.sortTable();
      });
    } else {
      this.setState({
        sortCode: '',
        list: this.props.list
      }, () => {
        this.setCurrentPage();
      });
    }
  }

  headers() {
    return this.props.headers.map((header, i) => (
      <th key={i} className="thStyle">
        {header.headerName}
        <button className="sortIcon" onClick={(e) => this.setSortOrder(header.mapKey)}>
          {
            this.state.sortCode === header.mapKey ? '∧' : '∨'
          }
        </button>
      </th>
    ));
  };

  selectRow(e, row) {
    if (this.props.downloadRows) {
      const selectedRow = [...this.state.selectedRow];

      if (!selectedRow.includes(row)) {
        e.currentTarget.style.background = '#e0f3fe';
        selectedRow.push(row);
      } else {
        const index = selectedRow.indexOf(row);

        selectedRow.splice(index, 1);
        e.currentTarget.style.background = '';
      }

      this.setState({ selectedRow });
    }
  }

  rows() {
    return this.state.currentPage.map((row, i) => (
      <tr
        className={this.props.downloadRows ? 'trActive' : ''}
        key={i} onClick={(e) => this.selectRow(e, row)}
        title={`Record No. ${i + 1}`}
      >
        {
          this.props.headers.map((key, i) => {
            const mapKey = key['mapKey'];

            return (
              <td
                key={i}
                className="tdStyle"
              >
                {row[mapKey]}
              </td>
            );
          })
        }
      </tr>
    ));
  }

  pagination() {
    const pages = [];

    if (this.state.totalPages > 0) {
      if (this.state.totalPages <= 5) {
        for (let i = 0; i < this.state.totalPages; i += 1) {
          pages.push(
            <PageNo currentPageNo={this.state.currentPageNo} key={i} pageNo={i + 1} callBack={this.setPageNo} />
          );
        }
      } else {
        if (this.state.currentPageNo > 1) {
          pages.push(
            <PageNo currentPageNo={this.state.currentPageNo} key={1} pageNo={1} callBack={this.setPageNo} />
          );
        }

        if (this.state.currentPageNo >= this.state.totalPages - 1) {
          pages.push(
            <PageNo currentPageNo={this.state.currentPageNo} key={2} pageNo={2} callBack={this.setPageNo} />
          );
        }

        if (this.state.currentPageNo > 2) {
          pages.push(
            <PageNo currentPageNo={this.state.currentPageNo} key={'1...'} pageNo={'...'} callBack={null} />
          );
        }

        if (this.state.currentPageNo === this.state.totalPages) {
          pages.push(
            <PageNo currentPageNo={this.state.currentPageNo} key={this.state.totalPages - 1} pageNo={this.state.totalPages - 1} callBack={this.setPageNo} />
          );
        }

        pages.push(
          <PageNo currentPageNo={this.state.currentPageNo} key={this.state.currentPageNo} pageNo={this.state.currentPageNo} callBack={this.setPageNo} />
        );

        if (this.state.currentPageNo === 1) {
          pages.push(
            <PageNo currentPageNo={this.state.currentPageNo} key={2} pageNo={2} callBack={this.setPageNo} />
          );
        }

        if (this.state.currentPageNo < (this.state.totalPages - 1)) {
          pages.push(
            <PageNo currentPageNo={this.state.currentPageNo} key={'2...'} pageNo={'...'} callBack={null} />
          );
        }
        if (this.state.currentPageNo < 3) {
          pages.push(
            <PageNo currentPageNo={this.state.currentPageNo} key={this.state.totalPages - 1} pageNo={this.state.totalPages - 1} callBack={this.setPageNo} />
          );
        }

        if (this.state.currentPageNo < this.state.totalPages) {
          pages.push(
            <PageNo currentPageNo={this.state.currentPageNo} key={this.state.totalPages} pageNo={this.state.totalPages} callBack={this.setPageNo} />
          );
        }
      }
    }

    return pages;
  }

  navigate(direction) {
    switch (direction) {
      case 'left': {
        if (this.state.currentPageNo > 1) {
          const newPageNo = this.state.currentPageNo - 1;
          this.setPageNo(newPageNo);
        }
        break;
      }

      case 'right': {
        if (this.state.currentPageNo < this.state.totalPages) {
          const newPageNo = this.state.currentPageNo + 1;
          this.setPageNo(newPageNo);
        }
        break;
      }

      default:
        break;
    }
  }

  setPageNo(pageNo) {
    this.setState({ currentPageNo: pageNo }, () => {
      this.updatePageNo(pageNo)
    });
  }

  updatePageNo(no) {
    if (no === 1) {
      this.setState({ prevPageLimit: 0, currentPageLimit: 1 });
    } else {
      const page = no * this.state.perPage;
      const prevPageLimit = page - this.state.perPage;
      const currentPageLimit = page;

      this.setState({ prevPageLimit, currentPageLimit });
    }
  }

  downloadTemplate() {
    return (
      <Download
        selectedRow={this.state.selectedRow}
        currentPage={this.state.currentPage}
        fullList={this.state.list}
        {...this.props}
      />
    );
  }

  pageCount() {
    const count = this.state.list.length > 100 ? 100 : this.state.list.length;
    const option = [];
    let i = 0;

    while (i < count) {
      option.push(
        <option value={i + 10}>{i + 10}</option>
      );

      i += 10;
    }

    return option;
  }

  setPerPageCount(e) {
    this.setState({
      perPage: e.target.value,
      currentPageNo: 1,
      goToPage: 1
    }, () => {
      this.updatePageNo(1);
    });
  }

  goToPage(e) {
    let pageNo = e.target.value;
    pageNo = pageNo.length > 0 ? parseInt(pageNo, 10) : pageNo;

    this.setState({ goToPage: pageNo }, () => {
      if (pageNo >= 1 && pageNo <= this.state.totalPages) {
        this.setPageNo(pageNo);
      }
    });
  }

  blurGoToPage() {
    if (this.state.goToPage.length === 0) {
      this.setState({ goToPage: this.state.currentPageNo });
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="csvTableContainer">
          <div className="spinner" />
        </div>
      );
    }

    if (this.state.list && this.state.list.length > 0) {
      return (
        <div className="csvTableContainer">
          <ul className="navStyle">
            {
              this.props.goToPage &&
              <li>
                <label className="navLabel">Goto</label>
                <input className="goToPage" onBlur={() => this.blurGoToPage()} type="number" min={1} value={this.state.goToPage} onChange={(e) => this.goToPage(e)} />
              </li>
            }
            <li>
              <label className="navLabel">Show</label>
              <select className="perPage" onChange={(e) => this.setPerPageCount(e)}>
                {this.pageCount()}
              </select>
            </li>
            <li key="left">
              <button className="navigateBtn" disabled={this.state.currentPageNo === 1} onClick={(e) => this.navigate('left')}>
                &#x2190;
              </button>
            </li>

            {this.pagination()}

            <li key="right">
              <button className="navigateBtn" disabled={this.state.currentPageNo === this.state.totalPages} onClick={(e) => this.navigate('right')}>
                &#x2192;
              </button>
            </li>
            {
              (this.props.downloadRows || this.props.downloadPage || this.props.downloadTable) &&
              this.downloadTemplate()
            }
          </ul>
          <table className="tableStyle">
            <thead><tr>{this.headers()}</tr></thead>
            <tbody
              className={this.props.zebraCross ? this.props.zebraCross === 'odd' ? "zebraOdd" : "zebraEven" : ''}
            >
              {this.rows()}
            </tbody>
          </table>
        </div>
      );
    }

    return null;
  }
}

export default Table;
