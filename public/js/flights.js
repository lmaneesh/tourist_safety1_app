export async function fetchDepartures(iataCode) {
    try {
        const res = await fetch(`/api/flights/departures/${iataCode.toUpperCase()}`);
        if (!res.ok) throw new Error("Failed to fetch flights");
        const data = await res.json();
        return data || [];
    } catch (err) {
        console.error("Flight fetch error:", err);
        return [];
    }
}

export function renderFlightCards(flights) {
    const container = document.getElementById("flight-cards");
    if (!container) return;
    container.innerHTML = "";

    if (flights.length === 0) {
        container.innerHTML = "<p>No flights found for this airport.</p>";
        return;
    }

    flights.forEach(f => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.marginBottom = "10px";
        card.style.border = "1px solid #ddd";

        card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="margin: 0;">${f.airline.name} — ${f.flight.iata}</h4>
        <span class="badge ${f.flight_status === 'active' ? 'bg-success' : 'bg-warning'}">${f.flight_status.toUpperCase()}</span>
      </div>
      <p style="margin: 5px 0;"><strong>To:</strong> ${f.arrival.airport} (${f.arrival.iata})</p>
      <p style="margin: 5px 0; font-size: 0.9em; color: #666;">
        📅 Scheduled: ${new Date(f.departure.scheduled).toLocaleString()}
      </p>
    `;

        container.appendChild(card);
    });
}
