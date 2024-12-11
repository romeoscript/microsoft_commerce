// components/Card.js
import PropTypes from 'prop-types';

const OrderDetailsCard = ({ title, content, buttonLabel, onButtonClick }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-green-500 p-2 rounded-full text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      </div>
      <div className="mb-4">
        {content}
      </div>
      <button 
        onClick={onButtonClick} 
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

OrderDetailsCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

export default OrderDetailsCard;
