<h2>React Table</h2>

<h4>
Light weight simple react table from where you can copy the rows from table and paste directly into Excel sheet as csv data. Upload excel sheet to display as table. Also you can download the table as excel. Along with that, you can do inline editing.
</h4>
<h3>Demo: https://codesandbox.io/s/k5kq105337</h3>

<p>npm install csv-react-table</p>
<p>yarn add csv-react-table</p>

```html
import Table from "csv-react-table";

<Table
  list={} //array object
  pageCount={} //no of rows to be showed per page.
  headers={} //table header
/>
```
<table>
  <thead>
    <tr>
      <th>Props</th>
      <th>Expected Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>list</td>
      <td>
        <p><strong>Mandatory. Type: Array object</strong></p>
        <pre>
         [
          {
            id: 1,
            name: 'Peter',
            sex: 'Male
          },
          {
            id: 2,
            name: 'Alice',
            sex: 'Female
          }
        ]
        </pre>
      </td>
    </tr>
    <tr>
      <td>headers</td>
      <td>
        <p><strong>Mandatory. Type: Array object</strong></p>
        <pre>
          [{
              headerName: 'Id',
              mapKey: 'id'
            },
            {
              headerName: 'Name',
              mapKey: 'name'
            },
            {
              headerName: 'Gender',
              mapKey: 'sex'
            }
          ]}
        </pre>
      </td>
    </tr>
    <tr>
      <td>goToPage</td>
      <td>
          <p><strong>Optional. Type: Boolean</strong></p>
          <p>
            Navigate to a particular page
          </p>
      </td>
    </tr>
    <tr>
      <td>downloadTable</td>
      <td>
          <p><strong>Optional. Type: Boolean</strong></p>
          <p>
            To download whole table as csv file
          </p>
      </td>
    </tr>
    <tr>
      <td>downloadRows</td>
      <td>
          <p><strong>Optional. Type: Boolean</strong></p>
          <p>
             To download selected rows as a csv file
          </p>
      </td>
    </tr>
    <tr>
      <td>downloadPage</td>
      <td>
          <p><strong>Optional. Type: Boolean</strong></p>
          <p>
             To download the current as a csv file
          </p>
      </td>
    </tr>
    <tr>
      <td>zebraCross</td>
      <td>
          <p><strong>Optional. Type: String</strong></p>
          <p>
            Zebra effect. Default value: none. Expected values: 'even' or 'odd'
          </p>
      </td>
    </tr>
    <tr>
      <td>filename</td>
      <td>
          <p><strong>Optional. Type: String </strong></p>
          <p>
            Name given to file for download.
          </p>
      </td>
    </tr>
    <tr>
      <td>downloadButtonStyle</td>
      <td>
          <p><strong>Optional. Type: Object </strong></p>
          <p>
            Custom styles for download buttons
          </p>
      </td>
    </tr>
    <tr>
      <td>downloadButtonClass</td>
      <td>
          <p><strong>Optional. Type: String </strong></p>
          <p>
            Custom class names for download buttons
          </p>
      </td>
    </tr>
    <tr>
      <td>paginationStyle</td>
      <td>
          <p><strong>Optional. Type: Object </strong></p>
          <p>
            Custom styles for pagination component
          </p>
      </td>
    </tr>
    <tr>
      <td>paginationClass</td>
      <td>
          <p><strong>Optional. Type: String </strong></p>
          <p>
            Custom class names for pagination component
          </p>
      </td>
    </tr>
    <tr>
      <td>activePageNumberClass</td>
      <td>
          <p><strong>Optional. Type: String </strong></p>
          <p>
            Styles of current page number in the pagination component
          </p>
      </td>
    </tr>
    <tr>
      <td>tableHeadStyle</td>
      <td>
          <p><strong>Optional. Type: Object </strong></p>
          <p>
            Custom styles for table header(thead)
          </p>
      </td>
    </tr>
    <tr>
    <tr>
      <td>tableHeadClass</td>
      <td>
          <p><strong>Optional. Type: String </strong></p>
          <p>
            Custom class names for table header(thead)
          </p>
      </td>
    </tr>
    <tr>
      <td>tableHeadRowStyle</td>
      <td>
          <p><strong>Optional. Type: Object </strong></p>
          <p>
            Custom styles for tr inside table head(thead>tr)
          </p>
      </td>
    </tr>
    <tr>
    <tr>
      <td>tableHeadRowClass</td>
      <td>
          <p><strong>Optional. Type: String </strong></p>
          <p>
            Custom class names for tr inside table head(thead>tr)
          </p>
      </td>
    </tr>
    <tr>
      <td>tableHeadColumnStyle</td>
      <td>
          <p><strong>Optional. Type: Object </strong></p>
          <p>
            Custom styles for th inside table head(thead>tr>th)
          </p>
      </td>
    </tr>
    <tr>
    <tr>
      <td>tableHeadColumnClass</td>
      <td>
          <p><strong>Optional. Type: String </strong></p>
          <p>
            Custom class names for th inside table head(thead>tr>th)
          </p>
      </td>
    </tr>
    <tr>
      <td>tableBodyStyle</td>
      <td>
          <p><strong>Optional. Type: Object </strong></p>
          <p>
            Custom styles for tbody inside table head(tbody)
          </p>
      </td>
    </tr>
    <tr>
    <tr>
      <td>tableBodyClass</td>
      <td>
          <p><strong>Optional. Type: String </strong></p>
          <p>
            Custom class names for for tbody inside table head(tbody)
          </p>
      </td>
    </tr>
    <tr>
      <td>tableRowStyle</td>
      <td>
          <p><strong>Optional. Type: Object </strong></p>
          <p>
            Custom styles for tr inside table body(tbody>tr)
          </p>
      </td>
    </tr>
    <tr>
    <tr>
      <td>tableRowClass</td>
      <td>
          <p><strong>Optional. Type: String </strong></p>
          <p>
            Custom class names for tr inside table body(tbody>tr)
          </p>
      </td>
    </tr>
    <tr>
      <td>tableColumnStyle</td>
      <td>
          <p><strong>Optional. Type: Object </strong></p>
          <p>
            Custom styles for td inside table body(tbody>tr>td)
          </p>
      </td>
    </tr>
    <tr>
    <tr>
      <td>tableRowClass</td>
      <td>
          <p><strong>Optional. Type: String </strong></p>
          <p>
            Custom class names for td inside table body(tbody>tr>td)
          </p>
      </td>
    </tr>
  </tbody>
</table>
