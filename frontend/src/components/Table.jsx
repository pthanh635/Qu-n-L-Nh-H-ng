export function Table({ columns, data, onEdit, onDelete }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
              <td className="actions">
                {onEdit && (
                  <button onClick={() => onEdit(row)} className="btn-edit">
                    Sửa
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(row.id)} className="btn-delete">
                    Xóa
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
