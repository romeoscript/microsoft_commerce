"use client";
import React, { useState, forwardRef } from "react";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputComponent = forwardRef(
  (
    {
      type = "text",
      placeholder = "",
      disabled = false,
      password = false,
      label = "",
      error = false,
      labelColor = "#000",
      accept = "",
      borderStyle = "full",
      register,
      name,
      defaultValue,
      onChange,
    },
    ref
  ) => {
    const [passwordType, setPasswordType] = useState(password ? "password" : type);
    const togglePasswordVisibility = () => {
      setPasswordType((prevType) =>
        prevType === "password" ? "text" : "password"
      );
    };

    const passwordToggleIcon = () => {
      return passwordType === "password" ? (
        <FaEyeSlash
          className="text-accent h-5 w-5 mx-2 cursor-pointer"
          onClick={togglePasswordVisibility}
        />
      ) : (
        <FaEye
          className="text-accent h-5 w-5 mx-2 cursor-pointer"
          onClick={togglePasswordVisibility}
        />
      );
    };

    const baseInputClass =
      "w-full py-1 px-3 outline-none border-none bg-inherit rounded-md no-number-arrows";

    const borderClass =
      borderStyle === "bottom"
        ? "border-b-2 border-accent"
        : "border border-accent rounded-md";

    return (
      <div className="grid">
        <p className="font-medium text-sm" style={{ color: labelColor }}>
          {label}
        </p>
        <div className="grid gap-1">
          <div
            className={`relative flex items-center py-2 bg-transparent ${borderClass} text-[#010101] text-base w-full ${
              error ? "border-red-600" : ""
            }`}
          >
            <input
              onChange={onChange}
              ref={ref}
              defaultValue={defaultValue}
              className={baseInputClass}
              type={passwordType}
              placeholder={placeholder}
              disabled={disabled}
              accept={accept}
              {...(register && register(name))} // Ensure register is a function and used correctly
            />
            {password && passwordToggleIcon()}
          </div>
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
      </div>
    );
  }
);

InputComponent.displayName = "InputComponent";

InputComponent.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  password: PropTypes.bool,
  label: PropTypes.string,
  defaultValue: PropTypes.string,
  labelColor: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  register: PropTypes.func,
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  accept: PropTypes.string,
  borderStyle: PropTypes.oneOf(["full", "bottom"]),
};

export default InputComponent;
