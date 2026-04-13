import { createElement } from "react";

export function Section({ eyebrow, title, description, children }) {
  return (
    <section
      className="playground-section"
      id={title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
    >
      <div className="playground-section__header">
        <div className="playground-section__eyebrow">{eyebrow}</div>
        <h2 className="playground-section__title">{title}</h2>
        {description ? (
          <p className="playground-section__description">{description}</p>
        ) : null}
      </div>
      <div className="playground-section__body">{children}</div>
    </section>
  );
}
