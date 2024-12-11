"use client";
import React from 'react';
import PropTypes from 'prop-types';

const SelectComponent = ({ label, options, error, register, name }) => {
  return (
    <div className="grid">
      <p className="font-medium text-sm">{label}</p>
      <select
        className={`w-full py-1 px-3 outline-none bg-inherit rounded-md border border-accent text-sm ${
          error ? 'border-red-600' : ''
        }`}
        {...register(name)}
      >
        <option value="">Select {label}</option>
        {options?.map((option, idx) => (
          <option key={idx} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

SelectComponent.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  error: PropTypes.string,
  register: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default SelectComponent;
