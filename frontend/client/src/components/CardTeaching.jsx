import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";

/* componente secundario usado en Teaching.jsx */
function CardTeaching({ img, title }) {
  const { contextTheme } = useThemeContext();
  return (
    <Link to="/teachingdata" className="no-line">
      <div className="card-section">
        <img
          style={{
            height: "150px",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width:"95%"
          }}
          src={img}
          className="rounded-2 shadow-sm"
        />
        <div
        id={contextTheme}
          className="fonts-letter"
          style={{ fontSize: "16px", height: "32px" }}
        >
        {title}
        </div>
      </div>
    </Link>
  );
}

CardTeaching.propTypes = {
  title: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
};

export default CardTeaching;
