export async function fetchTrains(from, to, date) {
    try {
        const res = await fetch(`/api/trains/between?from=${from.toUpperCase()}&to=${to.toUpperCase()}&date=${date}`);
        if (!res.ok) throw new Error("Failed to fetch trains");
        const data = await res.json();
        return data.trains || [];
    } catch (err) {
        console.error("Train fetch error:", err);
        return [];
    }
}

export async function fetchTrainStatus(trainNo) {
    try {
        const res = await fetch(`/api/trains/status/${trainNo}`);
        if (!res.ok) throw new Error("Failed to fetch status");
        return await res.json();
    } catch (err) {
        console.error("Status error:", err);
        return null;
    }
}

export function renderTrainCards(trains) {
    const container = document.getElementById("train-cards");
    if (!container) return;
    container.innerHTML = "";

    if (trains.length === 0) {
        container.innerHTML = "<p>No trains found for this route and date.</p>";
        return;
    }

    trains.forEach(t => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.marginBottom = "10px";
        card.style.border = "1px solid #ddd";

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4 style="margin: 0;">${t.train_name} (${t.train_number})</h4>
                <button class="btn btn-outline btn-sm status-btn" data-train="${t.train_number}" style="padding: 4px 8px; font-size: 0.8em;">Live Status</button>
            </div>
            <p style="margin: 5px 0;"><strong>From:</strong> ${t.from_station_name} | <strong>To:</strong> ${t.to_station_name}</p>
            <p style="margin: 5px 0; font-size: 0.9em; color: #666;">
                🕒 Dep: ${t.departure_time} | Arr: ${t.arrival_time}
            </p>
            <div id="status-${t.train_number}" style="margin-top: 10px; font-size: 0.85em; color: #007bff; display: none;">
                Loading status...
            </div>
        `;

        const statusBtn = card.querySelector(".status-btn");
        statusBtn.addEventListener("click", async () => {
            const statusDiv = card.querySelector(`#status-${t.train_number}`);
            if (statusDiv.style.display === "block") {
                statusDiv.style.display = "none";
                return;
            }

            statusDiv.style.display = "block";
            statusDiv.textContent = "Fetching live status...";

            const status = await fetchTrainStatus(t.train_number);
            if (status && status.current_station) {
                statusDiv.innerHTML = `
                    <strong>Currently:</strong> ${status.current_station}<br>
                    <strong>Status:</strong> ${status.status_as_of || 'Updated just now'}
                `;
            } else {
                statusDiv.textContent = "Live status not available at the moment.";
            }
        });

        container.appendChild(card);
    });
}
