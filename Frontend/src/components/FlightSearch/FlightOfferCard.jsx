import React, { useState } from 'react';
import './FlightOfferCard.css';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const FlightOfferCard = ({ offer }) => {
  const [showModal, setShowModal] = useState(false);
  const [fareRules, setFareRules] = useState(null);
  const [loadingRules, setLoadingRules] = useState(false);

  if (!offer || !offer.price || !offer.itineraries) return null;

  const price = `${offer.price.total} ${offer.price.currency}`;
  const isNDC = offer.source !== 'GDS';

  const travelerBreakdown = offer.travelerPricings.map(tp => {
    const count = 1;
    const typeMap = {
      ADULT: 'ADULT',
      CHILD: 'CHILD',
      INFANT: 'INFANT',
      HELD_INFANT: 'INFANT'
    };
    const label = typeMap[tp.travelerType] || tp.travelerType;
    return `${count > 1 ? count + ' ' : ''}${label}: ${tp.price.total} ${tp.price.currency}`;
  });

  const getFareRules = async () => {
    setShowModal(true);
    setLoadingRules(true);
    try {
      const response = await axios.post('/api/flight-fare-rules', offer);
      setFareRules(response.data);
    } catch (err) {
      console.error('Failed to fetch fare rules:', err);
      setFareRules(null);
    } finally {
      setLoadingRules(false);
    }
  };

  return (
    <div className="card shadow-sm border-2 mb-4 border-primary rounded p-3">
      <div className="d-flex justify-content-between align-items-start">
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

        <div className="text-end">
          {isNDC && <div className="badge bg-purple mb-2">NDC</div>}
          {travelerBreakdown.map((line, i) => (
            <div key={i} className="small text-muted">{line}</div>
          ))}
          <h5 className="text-danger mt-1">{price}</h5>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline-primary btn-sm" onClick={getFareRules}>Details</button>
            <button className="btn btn-outline-secondary btn-sm">System</button>
          </div>
          <button className="btn btn-primary btn-lg w-100 mt-2">Book</button>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Fare Rules</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingRules && <p>Loading fare rules...</p>}
          {!loadingRules && fareRules && (
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(fareRules.fareRules || 'No fare rule information available.', null, 2)}</pre>
          )}
          {!loadingRules && !fareRules && <p>No fare rule information available.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

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
