import PropTypes from "prop-types";

/* componente secundario usado en Teaching.jsx */
function CardMostImages(props) {
  return (
    <div className="card-section ">
    <div
      style={{
        height: "150px",
        backgroundImage: `url(${props.imager})`,
        backgroundSize: "cover", 
        backgroundPosition: "center", 
      }}
      className="rounded-2 shadow-sm"
    ></div>
    <div className="fonts-letter" style={{fontSize:"16px", height:"32px"}}>Como enfrentar el sufrimiento y la persecución</div>
    </div>
  );
}

CardMostImages.propTypes = {
  imager: PropTypes.string.isRequired,
}
export default CardMostImages;