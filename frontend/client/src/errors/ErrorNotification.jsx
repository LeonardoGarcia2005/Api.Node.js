import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ErrorNotification = ({ error }) => {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  }, [error]);

  return (
    <>
      {showError && (
        <div
        className="alert fixed-top alert-container mt-5 text-center mx-auto"
        style={{zIndex:"5000", width:"400px"}}
        role="alert"
      >
          {error}
        </div>
      )}
    </>
  );
};

ErrorNotification.propTypes = {
  error: PropTypes.string,
};

export default ErrorNotification;