import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import DottedLoader from "@/components/layout/loader/DottedLoader";
import "./animations.css"; // Import the custom CSS animations

const Button = ({
  title,
  type = "button",
  size = "medium",
  color = "accent",
  isBorder = false,
  isLoading = false,
  onClick = () => {},
  icon,
  iconProps = {},
  hoverAnimation = "none",
}) => {
  const baseStyles = "font-poppins rounded-lg transition-all duration-200";
  const sizeStyles = {
    small: "px-4 py-2 text-sm",
    medium: "px-7 py-3 text-base",
    large: "px-10 py-3 text-lg",
  };

  const colorStyles = {
    red: "bg-red-light text-white hover:bg-red-600",
    green: "bg-green-dark text-white hover:bg-green-light",
    blue: "bg-blue-500 text-white hover:bg-blue-600",
    gray: "bg-gray-300 text-gray-800 hover:bg-gray-400",
    accent: "bg-accent text-white hover:bg-accent-400",
  };

  const borderStyles = isBorder
    ? "border bg-white border-accent text-[#000] hover:border-accent hover:bg-[#219653] hover:text-white"
    : "";

  const hoverAnimations = {
    none: "",
    scale: "hover:scale-105",
    rotate: "hover:rotate-6",
    bounce: "hover:animate-bounce",
    gradientSlide: "hover:gradient-slide",

  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={classNames(
        baseStyles,
        sizeStyles[size],
        colorStyles[color],
        borderStyles,
        hoverAnimations[hoverAnimation],
        "flex items-center justify-center gap-2 text-center"
      )}
    >
      {isLoading ? (
        <DottedLoader />
      ) : (
        <>
          {icon && React.createElement(icon.type, { ...iconProps })}
          {title}
        </>
      )}
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.oneOf(["red", "green", "blue", "gray", "accent"]),
  isBorder: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  iconProps: PropTypes.object,
  hoverAnimation: PropTypes.oneOf(["none", "scale", "rotate", "bounce", "gradientSlide"]),
};

export default Button;
