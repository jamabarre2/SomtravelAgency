import React from 'react';
import './FlightOfferCard.css'; // custom styles (optional)

const FlightOfferCard = ({ offer }) => {
  const price = `${offer.price.total} ${offer.price.currency}`;
  const passengerInfo = `${offer.travelerPricings.length}P for ADT`;
  const isNDC = offer.source === 'GDS' ? false : true;

  return (
    <div className="card shadow-sm border-2 mb-4 border-danger rounded p-3">
      <div className="d-flex justify-content-between align-items-start">
        <div className="w-75">
          {offer.itineraries.map((itinerary, i) => (
            <div key={i} className="border-bottom pb-2 mb-2">
              {itinerary.segments.map((seg, idx) => (
                <div key={idx} className="d-flex align-items-start gap-3 mb-2">
                  <img
                    src={`https://pics.avs.io/60/60/${seg.carrierCode}.png`}
                    alt={seg.carrierCode}
                    className="rounded"
                    style={{ width: 40, height: 40 }}
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                  <div className="flex-grow-1">
                    <div>
                      <strong>{seg.carrierCode} {seg.number}</strong> • Economy ({seg.cabin})
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>{new Date(seg.departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                        <div>{new Date(seg.departure.at).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                        <span className="badge bg-warning text-dark">{seg.departure.iataCode}</span>
                      </div>
                      <div className="text-center text-muted" style={{ minWidth: '120px' }}>
                        Duration: {getDuration(seg.duration)}
                      </div>
                      <div>
                        <strong>{new Date(seg.arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                        <div>{new Date(seg.arrival.at).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                        <span className="badge bg-warning text-dark">{seg.arrival.iataCode}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right Side Summary */}
        <div className="text-end">
          {isNDC && (
            <div className="badge bg-purple mb-2">NDC</div>
          )}
          <div className="fw-bold text-end">{passengerInfo}</div>
          <h5 className="text-danger">{price}</h5>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline-primary btn-sm">Details</button>
            <button className="btn btn-outline-secondary btn-sm">System</button>
          </div>
          <button className="btn btn-danger w-100 mt-2">Book</button>
        </div>
      </div>
    </div>
  );
};

// Utility function for ISO 8601 duration like "PT3H50M"
function getDuration(duration) {
  const hours = duration.match(/(\d+)H/)?.[1] || '0';
  const minutes = duration.match(/(\d+)M/)?.[1] || '00';
  return `${hours}h ${minutes}m`;
}

export default FlightOfferCard;
