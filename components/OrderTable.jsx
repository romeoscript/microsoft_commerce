import Table from "./reusables/table/Table";

const OrdersPage = ({ transactions, onViewTransaction }) => {
  const isLoading = false; // Set this to true when loading data

  const columns = [
    {
      title: 'Transaction ID',
      key: 'id',
      render: (rowData) => <p>{rowData._id}</p>,
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (rowData) => <p>{rowData.amount}</p>,
    },
    {
      title: 'Transaction Reference',
      key: 'transactionRef',
      render: (rowData) => <p>{rowData.transactionRef}</p>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (rowData) => (
        <p className={
            rowData.status.toLowerCase() === 'successful' ? 'text-green-600' :
            rowData.status.toLowerCase() === 'failed' ? 'text-red-600' :
            'text-yellow-600'
        }>
          {rowData.status}
        </p>
      ),
    },
    {
      title: 'Date',
      key: 'transactionDate',
      render: (rowData) => <p>{new Date(rowData.transactionDate).toLocaleDateString()}</p>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (rowData) => (
        <button
          onClick={() => onViewTransaction(rowData.transactionRef)}
          className="text-white hover:underline bg-green-500 rounded-lg px-4 p-1"
        >
          View
        </button>
      ),
    },
  ];
  
  return (
    <div className="xl:px-[50px] px-4">
      <Table
        columns={columns}
        data={transactions}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OrdersPage;
