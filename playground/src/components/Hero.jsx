import { createElement } from "react";

export function Hero() {
  return (
    <section className="playground-hero">
      <div className="playground-hero__copy">
        <div className="playground-hero__eyebrow">EDTS Widget System</div>
        <h1>Run every custom package directly in the browser</h1>
        <p>
          Explore the widgets without opening Mendix first. This browser-first
          playground uses lightweight Mendix-style mock props for datasources,
          attributes, actions, and event flows.
        </p>
        <div className="playground-hero__chips">
          <span className="playground-hero__chip">Live interactions</span>
          <span className="playground-hero__chip">Widget routes</span>
          <span className="playground-hero__chip">Action logging</span>
        </div>
      </div>
      <div className="playground-hero__meta">
        <div className="playground-stat">
          <strong>8</strong>
          <span>widgets demoed</span>
        </div>
        <div className="playground-stat">
          <strong>Live</strong>
          <span>action logging</span>
        </div>
        <div className="playground-stat playground-stat--accent">
          <strong>Fast</strong>
          <span>preview loop</span>
        </div>
      </div>
    </section>
  );
}
