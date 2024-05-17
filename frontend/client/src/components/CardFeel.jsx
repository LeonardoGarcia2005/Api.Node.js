import PropTypes from "prop-types";
import { useThemeContext } from "../context/ThemeContext";
import { VERSE_FEEL } from "../graphql/feeling";
import { useLazyQuery } from "@apollo/client";

/* componente secundario proveniente del componente Homepage */
function CardFeel({ title, img, id, openVerseFeel }) {
  const { contextTheme } = useThemeContext();
  const [openVerse] = useLazyQuery(VERSE_FEEL) 

  const dataVerseFeel = async (id) => {
    const {data} = await openVerse({
      variables: {
        getOneVerseFeelingId: id
      }
    })
    openVerseFeel(data.getOneVerseFeeling)
    };

  return (
    <div
      className="card shadow rounded-5 mx-auto p-1 text-white row d-flex flex-wrap hover-card pointer"
      type="button"
      id={contextTheme}
      onClick={() => {dataVerseFeel(id)}}
    >
      <div className="col-12 d-flex flex-column align-items-center">
        <img src={img} alt="..." style={{width:"70px", height:"65px"}}/>
        <small className="text-center">{title}</small>
      </div>
    </div>
  );
}

CardFeel.propTypes = {
  title: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  openVerseFeel: PropTypes.func.isRequired
};

export default CardFeel;