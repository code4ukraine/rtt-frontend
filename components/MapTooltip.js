import normalizeDate from '../utils/normalizeDate';

const MapTooltip = (props) => {
  const { event, time, link } = props;

  return (
    // text and date
    <div
      style={{
        bottom: 10,
        margin: 'auto',
        width: '300',
        zIndex: 99,
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="container">

        <p
          style={{
            padding: '5px',
            fontSize: '14px',
            color: '#212529',
          }}
        >
          <a href={link} target="_blank" rel="noreferrer" >
            {event}
          </a>
          <br />
          <br />
          <strong>
            {normalizeDate(time)}
          </strong>
        </p>
      </div>
    </div>
  );
}

export default MapTooltip;