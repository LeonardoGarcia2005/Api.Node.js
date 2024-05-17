import { PropTypes } from 'prop-types'

/* componente secundario proveniente del componente Homepage */
function CardDay({week, style}) {
  return (
    <div className="mx-2 rounded-circle" style={style}>
        <div className="d-flex justify-content-center text-white txt-shadow card-day-res"> 
        <div className='font-number-day my-auto'>{week}</div>
        </div>
    </div>
  )
}

CardDay.propTypes = {
   week: PropTypes.string.isRequired,
   style: PropTypes.object
}
export default CardDay