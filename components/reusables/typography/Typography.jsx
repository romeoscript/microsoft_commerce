import PropTypes from "prop-types";
import classNames from "classnames";

const Typography = ({
  children,
  size = "md",
  variant = "body",
  className,
  ...props
}) => {
  const baseStyles = "font-poppins";

  const sizeStyles = {
    sm: "text-sm", // 14px
    md: "text-base", // 20px
    lg: "text-lg", // 24px
    xl: "text-xl", // 32px
  };

  const variantStyles = {
    h1: "font-bold",
    h2: "font-semibold",
    h3: "font-medium",
    body: "font-normal",
  };

  const Component = variant === "body" ? "p" : variant;

  return (
    <Component
      className={classNames(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

Typography.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  variant: PropTypes.oneOf(["h1", "h2", "h3", "body"]),
  className: PropTypes.string,
  role: PropTypes.string,
  "aria-label": PropTypes.string,
  "aria-hidden": PropTypes.bool,
};

export default Typography;

// Example usage

{/* <Typography size="small"
     variant="body"
      aria-label="Small body text">
  This is a small body text (14px)
</Typography>; */}
