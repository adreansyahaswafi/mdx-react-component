import { createElement } from "react";
import "./ui/Preview.css";

export function preview() {
    return (
        <div className="edts-calendar-preview">
            <div className="calendar-header">
                <span>◀</span>
                <strong>Preview Widget - Edts Calendar</strong>
                <span>▶</span>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <span style={{ padding: "6px 10px", borderRadius: 999, background: "#dbeafe", color: "#1d4ed8", fontSize: 12, fontWeight: 700 }}>Day</span>
                <span style={{ padding: "6px 10px", borderRadius: 999, background: "#dbeafe", color: "#1d4ed8", fontSize: 12, fontWeight: 700 }}>Week</span>
                <span style={{ padding: "6px 10px", borderRadius: 999, background: "#dbeafe", color: "#1d4ed8", fontSize: 12, fontWeight: 700 }}>List</span>
                <span style={{ padding: "6px 10px", borderRadius: 999, background: "#dbeafe", color: "#1d4ed8", fontSize: 12, fontWeight: 700 }}>Month</span>
                <span style={{ padding: "6px 10px", borderRadius: 999, background: "#dbeafe", color: "#1d4ed8", fontSize: 12, fontWeight: 700 }}>Year</span>
            </div>

            <div className="calendar-grid">
                <div className="day">Sun</div>
                <div className="day">Mon</div>
                <div className="day">Tue</div>
                <div className="day">Wed</div>
                <div className="day">Thu</div>
                <div className="day">Fri</div>
                <div className="day">Sat</div>

                {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="date">
                        <span className="date-number">{i + 1 <= 28 ? i + 1 : ""}</span>
                        {i === 10 && <div className="event">Event A</div>}
                        {i === 15 && <div className="event secondary">Event B</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}
