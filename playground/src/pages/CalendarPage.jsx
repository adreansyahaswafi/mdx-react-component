import { createElement } from "react";

import { EdtsCalendar } from "@packages/edtsCalendar/src/EdtsCalendar";

import { Section } from "../components/Section";

export function CalendarPage(props) {
  const {
    calendarEventSource,
    calendarTitleAttr,
    calendarStartAttr,
    calendarEndAttr,
    calendarColorAttr,
    selectedDateAttr,
    selectedEventIdAttr,
    selectedEventTitleAttr,
    selectedEventStartAttr,
    selectedEventEndAttr,
    onDateSelectAction,
    onEventClickAction,
    onEventChangeAction,
    calendarContext,
  } = props;

  return (
    <Section
      eyebrow="Calendar widget"
      title="Interactive scheduling playground"
      description="Drag, resize, click dates, and inspect how the widget emits event data."
    >
      <div className="playground-calendar-shell">
        <EdtsCalendar
          eventSource={calendarEventSource}
          titleAttr={calendarTitleAttr}
          startAttr={calendarStartAttr}
          endAttr={calendarEndAttr}
          color={calendarColorAttr}
          initialView="day"
          showViewSwitcher
          selectedDateAttr={selectedDateAttr}
          selectedEventIdAttr={selectedEventIdAttr}
          selectedEventTitleAttr={selectedEventTitleAttr}
          selectedEventStartAttr={selectedEventStartAttr}
          selectedEventEndAttr={selectedEventEndAttr}
          onDateSelect={onDateSelectAction}
          onEventClick={onEventClickAction}
          onEventChange={onEventChangeAction}
        />
        <div className="playground-context-card">
          <div className="playground-context-card__title">
            Current context mirrors
          </div>
          <dl className="playground-context-card__grid">
            <div>
              <dt>Selected date</dt>
              <dd>{String(calendarContext.selectedDate || "-")}</dd>
            </div>
            <div>
              <dt>Event id</dt>
              <dd>{calendarContext.selectedEventId || "-"}</dd>
            </div>
            <div>
              <dt>Event title</dt>
              <dd>{calendarContext.selectedEventTitle || "-"}</dd>
            </div>
            <div>
              <dt>Event start</dt>
              <dd>{String(calendarContext.selectedEventStart || "-")}</dd>
            </div>
            <div>
              <dt>Event end</dt>
              <dd>{String(calendarContext.selectedEventEnd || "-")}</dd>
            </div>
          </dl>
        </div>
      </div>
    </Section>
  );
}
