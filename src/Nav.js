import React from 'react';
import PropTypes from 'prop-types';

const Nav = (props) => (
  <div className="spreadsheet__table-dir">
    <button
      className="spreadsheet__table-prev sheet-btn"
      onClick={(e) => props.changePage(e, 'prev')}
      styles={props.styles}
    >
      Prev
    </button>
    <span className="spreadsheet__table-pageno">
      <input type="number" onChange={(e) => props.changePage(e, null)} value={props.pageno} />
    </span>
    <button
      className="spreadsheet__table-next sheet-btn"
      onClick={(e) => props.changePage(e, 'next')}
      styles={props.styles}
    >
      Next
    </button>
  </div>
);

Nav.propTypes = {
  styles: PropTypes.string,
  changePage: PropTypes.func,
  pageno: PropTypes.number
};

export default Nav;
