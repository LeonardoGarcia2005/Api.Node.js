import PropTypes from "prop-types";
import "../styles/Char.css";
import { Link } from "react-router-dom";

/* componente secundario proveniente del componente Character */
function CardChar({ name, style, img, characterId}) {
  return (
    <>
      <Link
        to={`/characterdata/${characterId}`}
        className="card card-scale shadow mx-2 text-white no-line"
        style={style}
      >
        <div className="d-flex justify-content-between">
          <h4 className="text-start my-auto mx-3 font-char no-select">{name}</h4>
          <img
            src={img}
            className="me-1 no-select"
            alt="..."
            style={{ width: "100px", height: "100px", opacity: "0.9" }}
          />
        </div>
      </Link>
    </>
  );
}

CardChar.propTypes = {
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
  img: PropTypes.string.isRequired,
  characterId: PropTypes.string.isRequired,
};

export default CardChar;