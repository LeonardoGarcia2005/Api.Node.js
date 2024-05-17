import PropTypes from "prop-types";
import "../styles/bibleOf.css";
import { useThemeContext } from "../context/ThemeContext";

/* componente secundario usado en InicialBible.jsx y OfficialBible.jsx */
function CardVerses({ verse }) {
  const { contextTheme } = useThemeContext();

  return (
    <div
      className="border rounded-2 hover-card"
      type="button"
      style={{ height: "30px" }}
      id={contextTheme}
    >
      <h6
        className="text-center mt-1 "
        style={{ width: "30px" }}
      >
        {verse.verse}
      </h6>
    </div>
  );
}

CardVerses.propTypes = {
  verse: PropTypes.shape({
    verse: PropTypes.number.isRequired,
  }).isRequired,
};

export default CardVerses;
