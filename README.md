<h1>React Table</h1>

<h4>Light weight simple react table from where you can copy the rows from table and paste directly into Excel sheet as csv data.</h4>

<p>npm install react-table-spreadsheet</p>
<p>yarn add react-table-spreadsheet</p>

```html
import Table "react-table-spreadsheet";

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
        <p><strong>Mandatory</strong></p>
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
        <p><strong>Optional</strong></p>
        Value can be any number. Default value is 10
      </td>
    </tr>
    <tr>
      <td>headers</td>
      <td>
        <p><strong>Mandatory</strong></p>
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
  </tbody>
</table>

<h3>Copy Table rows</h3>
<p>Click on table rows which needs to copy as comma seperated values. Also, you can select/deselect whole table page.</p>
