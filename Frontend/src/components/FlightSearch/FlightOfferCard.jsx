import React from 'react';
import './FlightOfferCard.css'; // optional styles

const FlightOfferCard = ({ offer }) => {
  if (!offer || !offer.price || !offer.itineraries) {
    return null;
  }

  const price = `${offer.price.total} ${offer.price.currency}`;
  const passengerInfo = `${offer.travelerPricings?.length || 1}P for ADT`;
  const isNDC = offer.source !== 'GDS';

  return (
    <div className="card shadow-sm border-2 mb-4 border-primary rounded p-3">
      <div className="d-flex justify-content-between align-items-start">
        {/* Left: Itineraries */}
        <div className="w-75">
          {offer.itineraries.map((itinerary, i) => (
            <div key={i} className="border-bottom pb-2 mb-2">
              <div className="mb-2 text-muted small text-end">
                Total Journey Time: <strong>{getTotalJourneyTime(itinerary)}</strong>
              </div>

              {itinerary.segments.map((seg, idx) => {
                const showLayover = idx > 0;
                const prevSegment = itinerary.segments[idx - 1];
                const layoverTime = showLayover
                  ? getLayoverTime(prevSegment.arrival.at, seg.departure.at)
                  : null;

                return (
                  <React.Fragment key={idx}>
                    {showLayover && (
                      <div className="text-center text-muted small mb-2">
                        Layover in {prevSegment.arrival.iataCode}: <strong>{layoverTime}</strong>
                      </div>
                    )}

                    <div className="d-flex align-items-start gap-3 mb-2">
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
                            <strong>{formatTime(seg.departure.at)}</strong>
                            <div>{formatDate(seg.departure.at)}</div>
                            <span className="badge bg-warning text-dark">{seg.departure.iataCode}</span>
                          </div>
                          <div className="text-center text-muted" style={{ minWidth: '120px' }}>
                            Duration: {getDuration(seg.duration)}
                          </div>
                          <div>
                            <strong>{formatTime(seg.arrival.at)}</strong>
                            <div>{formatDate(seg.arrival.at)}</div>
                            <span className="badge bg-warning text-dark">{seg.arrival.iataCode}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>

        {/* Right: Price and Action */}
        <div className="text-end">
          {isNDC && <div className="badge bg-purple mb-2">NDC</div>}
          <div className="fw-bold text-end">{passengerInfo}</div>
          <h5 className="text-danger">{price}</h5>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline-primary btn-sm">Details</button>
            <button className="btn btn-outline-secondary btn-sm">System</button>
          </div>
          <button className="btn btn-primary btn-lg w-100 mt-2">Book</button>
        </div>
      </div>
    </div>
  );
};

// --- Utilities ---

function getDuration(duration) {
  const hours = duration.match(/(\d+)H/)?.[1] || '0';
  const minutes = duration.match(/(\d+)M/)?.[1] || '00';
  return `${hours}h ${minutes}m`;
}

function parseISODuration(durationStr) {
  const hours = parseInt(durationStr.match(/(\d+)H/)?.[1] || '0', 10);
  const minutes = parseInt(durationStr.match(/(\d+)M/)?.[1] || '0', 10);
  return hours * 60 + minutes;
}

function getLayoverTime(prevArrival, nextDeparture) {
  const arrival = new Date(prevArrival);
  const departure = new Date(nextDeparture);
  const diffMs = departure - arrival;
  if (diffMs < 0) return '0h 0m';

  const totalMin = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  return `${hours}h ${minutes}m`;
}

function getTotalJourneyTime(itinerary) {
  let totalMinutes = 0;

  itinerary.segments.forEach((seg, idx) => {
    totalMinutes += parseISODuration(seg.duration);

    if (idx > 0) {
      const prev = new Date(itinerary.segments[idx - 1].arrival.at);
      const next = new Date(seg.departure.at);
      const layoverMin = Math.floor((next - prev) / (1000 * 60));
      totalMinutes += layoverMin > 0 ? layoverMin : 0;
    }
  });

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

export default FlightOfferCard;
