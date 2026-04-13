import { createElement } from "react";

export function ActionLog({ log, onMinimize }) {
  return (
    <aside className="playground-log">
      <div className="playground-log__header">
        <div>
          <div className="playground-log__eyebrow">Live terminal</div>
          <div className="playground-log__title">Widget actions stream</div>
        </div>
        <div className="playground-log__actions">
          <button
            type="button"
            className="playground-log__minimize"
            onClick={onMinimize}
          >
            Minimize
          </button>
          <button
            type="button"
            className="playground-log__clear"
            onClick={log.clear}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="playground-log__entries">
        {log.entries.length ? (
          log.entries.map((entry) => (
            <div key={entry.id} className="playground-log__entry">
              <div className="playground-log__entry-top">
                <strong>
                  <span className="playground-log__prompt">$</span>
                  {entry.label}
                </strong>
                <span>{entry.at}</span>
              </div>
              <pre>{JSON.stringify(entry.payload, null, 2)}</pre>
            </div>
          ))
        ) : (
          <div className="playground-log__empty">
            Interact with the widgets to see actions here.
          </div>
        )}
      </div>
    </aside>
  );
}
