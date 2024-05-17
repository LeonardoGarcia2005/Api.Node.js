import PropTypes from "prop-types";
import '../styles/bibleOf.css';
import { useThemeContext } from "../context/ThemeContext";

/* componente secundario usado en InicialBible.jsx y OfficialBible.jsx */
function CardChapter({ chapter }) {
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
        {chapter.chapter}
      </h6>
    </div>
  );
}

CardChapter.propTypes = {
  chapter: PropTypes.shape({
    chapter: PropTypes.number.isRequired,
  }).isRequired,
};

export default CardChapter;
