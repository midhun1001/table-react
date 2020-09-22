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
      selectedRow: []
    };

    this.setPageNo = this.setPageNo.bind(this);
  }

  componentDidMount() {
    this.setCurrentPage();
    const totalPages = Math.ceil(this.props.list.length / this.state.perPage);
    this.setState({ totalPages });
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.prevPageLimit !== this.state.prevPageLimit)
      || (prevState.perPage !== this.state.perPage)) {
      this.setCurrentPage();
    }
  }

  setCurrentPage() {
    const list = [...this.props.list];
    const currentPage = list.splice(this.state.prevPageLimit, this.state.perPage);

    this.setState({ currentPage });
  }

  headers() {
    return this.props.headers.map((header, i) => (
      <th key={i} className="thStyle">{header.headerName}</th>
    ));
  };

  selectRow(e, row) {
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

  rows() {
    return this.state.currentPage.map((row, i) => (
      <tr key={i} onClick={(e) => this.selectRow(e, row)}>
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
        {...this.props}
      />
    );
  }

  render() {
    return (
      <div>
        <ul className="navStyle">
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
}

export default Table;
