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
      <td>pageCount</td>
      <td>
        <p><strong>Optional. Type: Number</strong></p>
        Value can be any number. Default value is 10
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
      <td>theadStyle</td>
      <td>
          <p><strong>Optional. Type: String</strong></p>
          <p>
            Pass the className to alter the styles of thead
          </p>
          <pre>
            <strong>Example</strong>
            .headerStyle {
              tr {
                background: #E57373;
                th {
                  padding: 5px 10px
                }
              }
            }
          </pre>
      </td>
    </tr>
    <tr>
      <td>tbodyStyle</td>
      <td>
          <p><strong>Optional. Type: String</strong></p>
          <p>
            Pass the className to alter the styles of tbody
          </p>
          <pre>
            <strong>Example</strong>
            .bodyStyle {
              tr {
                background: #8e8e8e;
                color: #fff;
                td {
                  padding: 5px;
                }
              }
            }
          </pre>
      </td>
    </tr>
    <tr>
      <td>btnBg</td>
      <td>
          <p><strong>Optional. Type: String</strong></p>
          <p>
            Pass the color to change the color of the buttons
          </p>
      </td>
    </tr>
    <tr>
      <td>csv</td>
      <td>
          <p><strong>Optional. Type: Boolean</strong></p>
          <p>
            To enable the functionality download as csv file and to activate copy the rows in csv format
          </p>
      </td>
    </tr>
    <tr>
      <td>edited</td>
      <td>
          <p><strong>Optional. Type: Function</strong></p>
          <p>
            Callback function to get the editable row data in json format.
            Double click the column to edit it's content
            <strong>Note: edited prop should pass in order to activate inline editing</strong>
          </p>
      </td>
    </tr>
    <tr>
      <td>upload</td>
      <td>
          <p><strong>Optional. Type: Boolean </strong></p>
          <p>
            To enable csv file upload.
          </p>
          <p><strong>Note: First line will be considered as Header.</strong></p>
      </td>
    </tr>
    <tr>
      <td>filename</td>
      <td>
          <p><strong>Optional. Type: String </strong></p>
          <p>
            NAme given to file for download.
          </p>
          <p><strong>Note: Give name without extension</strong></p>
      </td>
    </tr>
  </tbody>
</table>
