import React from 'react';
import PropTypes from 'prop-types';
import CircularLoader from '@/components/layout/loader/CirclarLoader';
import DottedLoader from '@/components/layout/loader/DottedLoader';

const Table = ({ columns, data, onRowClick, isLoading }) => {
  const colHeaders = columns?.map(({ title, key }) => (
    <th
      key={key}
      className="text-white uppercase"
    >
      <p className='bg-accent py-4 px-6 text-sm text-center font-[400] w-full'>
        {title}
      </p>
    </th>
  ));

  const tableData = data && data.map((rowData, i) => (
    <tr
      onClick={() => onRowClick && onRowClick(rowData)}
      key={`row-${i}`}
      className={`text-left text-sm font-Poppins  cursor-pointer ${
        rowData?.status?.toLowerCase() === "successful" || rowData?.status?.toLowerCase() === "active"
          ? "hover:bg-green/30 "
          : rowData?.status?.toLowerCase() === "failed" || rowData?.status?.toLowerCase() === "inactive"
          ? "hover:bg-red/30 "
          : "hover:bg-[#F7CB73]/20 "
      }`}
    >
      {columns.map(({ render }, id) => (
        <td key={`data-${i}-${id}`} className="py-4 px-6 border-gray-200">
          {render ? render(rowData, i) : rowData[id]}
        </td>
      ))}
    </tr>
  ));

  const emptyStateRow = (
    <tr>
      <td colSpan={columns.length} className="py-4 px-6 text-center text-gray-500">
        No data available
      </td>
    </tr>
  );

  const loadingStateRow = (
    <tr>
      <td colSpan={columns.length} className="py-4 px-6 text-center">
       <CircularLoader  />
      </td>
    </tr>
  );

  return (
    <div className="overflow-auto p-2 shadow-lg box-shadow-sm border rounded-lg">
      <table className="min-w-full w-full border-collapse">
        <thead>
          <tr className="border-gray-700">{colHeaders}</tr>
        </thead>
        <tbody>
          {isLoading ? (
            loadingStateRow
          ) : data && data.length ? (
            tableData
          ) : (
            emptyStateRow
          )}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      render: PropTypes.func.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRowClick: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
};

export default Table;
