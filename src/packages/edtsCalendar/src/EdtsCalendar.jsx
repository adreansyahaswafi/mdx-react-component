import { createElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
// eslint-disable-next-line sort-imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";

import "./ui/EdtsCalendar.css";

function getAttributeValue(attribute, item, fallback = null) {
    if (!attribute || !attribute.get) {
        return fallback;
    }

    const attributeValue = attribute.get(item);
    return attributeValue && attributeValue.value != null ? attributeValue.value : fallback;
}

function setDatasourceAttributeValue(attribute, item, value) {
    if (!attribute || !attribute.get || !item) {
        return;
    }

    const attributeValue = attribute.get(item);

    if (!attributeValue || typeof attributeValue.setValue !== "function" || attributeValue.readOnly) {
        return;
    }

    attributeValue.setValue(value);
}

function getDefaultEventEnd(start, end) {
    if (end instanceof Date) {
        return end;
    }

    if (!(start instanceof Date)) {
        return end || null;
    }

    return new Date(start.getTime() + 60 * 60 * 1000);
}

function formatTime24(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        return "";
    }

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
}

function getEventTimeRange(event) {
    if (!event) {
        return "";
    }

    if (event.allDay) {
        return "All day";
    }

    const startText = formatTime24(event.start);
    const endText = formatTime24(event.end);

    if (startText && endText) {
        return `${startText} - ${endText}`;
    }

    return startText || endText || "";
}

function renderEventContent(eventInfo) {
    const timeText = eventInfo && eventInfo.event ? getEventTimeRange(eventInfo.event) : "";
    const title = eventInfo && eventInfo.event ? eventInfo.event.title : "";

    return (
        <div className="edts-calendar-event-card">
            {timeText ? <div className="edts-calendar-event-time">{timeText}</div> : null}
            <div className="edts-calendar-event-title">{title}</div>
        </div>
    );
}

export function EdtsCalendar({
    eventSource,
    titleAttr,
    startAttr,
    endAttr,
    initialView,
    showViewSwitcher,
    selectedDateAttr,
    selectedEventIdAttr,
    selectedEventTitleAttr,
    selectedEventStartAttr,
    selectedEventEndAttr,
    onDateSelect,
    onEventClick,
    onEventChange,
    color
}) {
    const eventItems =
        eventSource && eventSource.status === "available" && Array.isArray(eventSource.items) ? eventSource.items : [];
    const lastEventChangeRef = useRef({
        signature: "",
        at: 0
    });
    const [nowMarkerPercentage, setNowMarkerPercentage] = useState(() => {
        const currentTime = new Date();

        return ((currentTime.getHours() * 60 + currentTime.getMinutes()) / (24 * 60)) * 100;
    });

    useEffect(() => {
        const updateNowMarker = () => {
            const currentTime = new Date();
            const totalMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

            setNowMarkerPercentage((totalMinutes / (24 * 60)) * 100);
        };

        updateNowMarker();

        const intervalId = setInterval(updateNowMarker, 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    const resolvedInitialView = useMemo(() => {
        if (initialView === "day") {
            return "timeGridDay";
        }

        if (initialView === "week") {
            return "timeGridWeek";
        }

        if (initialView === "year") {
            return "multiMonthYear";
        }

        if (initialView === "list") {
            return "listMonth";
        }

        return "dayGridMonth";
    }, [initialView]);

    const headerToolbar = useMemo(() => {
        if (!showViewSwitcher) {
            return {
                left: "prev,next today",
                center: "title",
                right: ""
            };
        }

        return {
            left: "prev,next today",
            center: "title",
            right: "timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear,listMonth"
        };
    }, [showViewSwitcher]);

    const events = useMemo(
        () => {
            const calendarEvents = [];

            eventItems.forEach(item => {
                const title = getAttributeValue(titleAttr, item, "Event");
                const start = getAttributeValue(startAttr, item);
                const end = getAttributeValue(endAttr, item);
                const colorValue = getAttributeValue(color, item);

                if (!start) {
                    return;
                }

                const event = {
                    id: item.id,
                    title,
                    start,
                    end: getDefaultEventEnd(start, end),
                    allDay: false,
                    mxItem: item
                };

                if (colorValue) {
                    event.color = colorValue;
                    event.backgroundColor = colorValue;
                    event.borderColor = colorValue;
                }

                calendarEvents.push(event);
            });

            return calendarEvents;
        },
        [eventItems, titleAttr, startAttr, endAttr, color]
    );

    const findEventItem = useCallback(
        calendarEvent => {
            if (!calendarEvent || !calendarEvent.id) {
                return undefined;
            }

            if (calendarEvent.extendedProps && calendarEvent.extendedProps.mxItem) {
                return calendarEvent.extendedProps.mxItem;
            }

            const directMatch = eventItems.find(item => String(item.id) === String(calendarEvent.id));

            if (directMatch) {
                return directMatch;
            }

            return eventItems.find(item => {
                const itemTitle = getAttributeValue(titleAttr, item, "Event");
                const itemStart = getAttributeValue(startAttr, item);
                const itemEnd = getAttributeValue(endAttr, item);

                return (
                    itemTitle === calendarEvent.title &&
                    String(itemStart || "") === String(calendarEvent.start || "") &&
                    String(itemEnd || "") === String(calendarEvent.end || "")
                );
            });
        },
        [endAttr, eventItems, startAttr, titleAttr]
    );

    const getCalendarEvent = useCallback(info => {
        return info && info.event ? info.event : null;
    }, []);

    const getEventActionArgs = useCallback(info => {
        const calendarEvent = info && info.event ? info.event : null;

        return {
            eventId: calendarEvent && calendarEvent.id ? String(calendarEvent.id) : undefined,
            eventTitle: calendarEvent ? calendarEvent.title : undefined,
            eventStart: calendarEvent ? calendarEvent.start : undefined,
            eventEnd: calendarEvent ? calendarEvent.end : undefined
        };
    }, []);

    const syncEventToContext = useCallback(eventArgs => {
        if (selectedEventIdAttr && typeof selectedEventIdAttr.setValue === "function" && !selectedEventIdAttr.readOnly) {
            selectedEventIdAttr.setValue(eventArgs.eventId);
        }

        if (selectedEventTitleAttr && typeof selectedEventTitleAttr.setValue === "function" && !selectedEventTitleAttr.readOnly) {
            selectedEventTitleAttr.setValue(eventArgs.eventTitle);
        }

        if (selectedEventStartAttr && typeof selectedEventStartAttr.setValue === "function" && !selectedEventStartAttr.readOnly) {
            selectedEventStartAttr.setValue(eventArgs.eventStart);
        }

        if (selectedEventEndAttr && typeof selectedEventEndAttr.setValue === "function" && !selectedEventEndAttr.readOnly) {
            selectedEventEndAttr.setValue(eventArgs.eventEnd);
        }
    }, [selectedEventEndAttr, selectedEventIdAttr, selectedEventStartAttr, selectedEventTitleAttr]);

    const executeActionLater = useCallback((action, variables, delay = 0) => {
        setTimeout(() => {
            if (!action || !action.canExecute) {
                return;
            }

            if (variables) {
                action.execute(variables);
                return;
            }

            action.execute();
        }, delay);
    }, []);

    const executeDatasourceAction = useCallback((actionValue, item, variables, delay = 0) => {
        if (!item || !actionValue) {
            return;
        }

        setTimeout(() => {
            const action = typeof actionValue.get === "function" ? actionValue.get(item) : actionValue;

            if (!action || !action.canExecute) {
                return;
            }

            if (variables) {
                action.execute(variables);
                return;
            }

            action.execute();
        }, delay);
    }, []);

    const isDuplicateEventChange = useCallback(info => {
        const calendarEvent = getCalendarEvent(info);

        if (!calendarEvent) {
            return false;
        }

        const signature = [
            String(calendarEvent.id || ""),
            String(calendarEvent.start ? calendarEvent.start.getTime() : ""),
            String(calendarEvent.end ? calendarEvent.end.getTime() : ""),
            String(calendarEvent.title || "")
        ].join("|");

        const now = Date.now();

        if (
            lastEventChangeRef.current.signature === signature &&
            now - lastEventChangeRef.current.at < 400
        ) {
            return true;
        }

        lastEventChangeRef.current = {
            signature,
            at: now
        };

        return false;
    }, [getCalendarEvent]);

    const handleDateSelect = useCallback(info => {
        const selectedStart = info && info.date ? info.date : info && info.start ? info.start : null;
        const selectedEnd = selectedStart ? getDefaultEventEnd(selectedStart, info && info.end ? info.end : null) : null;
        const selectedDate = selectedStart;

        if (selectedDateAttr && typeof selectedDateAttr.setValue === "function" && !selectedDateAttr.readOnly && selectedDate) {
            selectedDateAttr.setValue(selectedDate);
        }

        if (
            selectedEventStartAttr &&
            typeof selectedEventStartAttr.setValue === "function" &&
            !selectedEventStartAttr.readOnly
        ) {
            selectedEventStartAttr.setValue(selectedStart);
        }

        if (
            selectedEventEndAttr &&
            typeof selectedEventEndAttr.setValue === "function" &&
            !selectedEventEndAttr.readOnly
        ) {
            selectedEventEndAttr.setValue(selectedEnd);
        }

        if (onDateSelect && selectedDate) {
            executeActionLater(onDateSelect, {
                selectedDate,
                selectedStart,
                selectedEnd
            });
        }
    }, [executeActionLater, onDateSelect, selectedDateAttr, selectedEventEndAttr, selectedEventStartAttr]);

    const handleEventClick = useCallback(info => {
        const calendarEvent = getCalendarEvent(info);
        const eventArgs = getEventActionArgs(info);
        const item = findEventItem(calendarEvent);

        syncEventToContext(eventArgs);
        executeDatasourceAction(onEventClick, item);
    }, [executeDatasourceAction, findEventItem, getCalendarEvent, getEventActionArgs, onEventClick, syncEventToContext]);

    const handleEventChange = useCallback(info => {
        if (isDuplicateEventChange(info)) {
            return;
        }

        const calendarEvent = getCalendarEvent(info);
        const eventArgs = getEventActionArgs(info);
        if (selectedDateAttr && typeof selectedDateAttr.setValue === "function" && !selectedDateAttr.readOnly) {
            selectedDateAttr.setValue(eventArgs.eventStart || null);
        }

        const item = findEventItem(calendarEvent);

        if (item) {
            setDatasourceAttributeValue(startAttr, item, eventArgs.eventStart);
            setDatasourceAttributeValue(endAttr, item, eventArgs.eventEnd);
        }

        syncEventToContext(eventArgs);
        executeDatasourceAction(onEventChange, item, eventArgs, 50);
    }, [
        endAttr,
        executeDatasourceAction,
        findEventItem,
        getCalendarEvent,
        getEventActionArgs,
        isDuplicateEventChange,
        onEventChange,
        selectedDateAttr,
        startAttr,
        syncEventToContext
    ]);

    if (!eventSource || eventSource.status !== "available") {
        return <div>Loading...</div>;
    }

    return (
        <div className="edts-calendar" style={{ "--edts-calendar-now-percentage": `${nowMarkerPercentage}%` }}>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, listPlugin, multiMonthPlugin, timeGridPlugin]}
                initialView={resolvedInitialView}
                headerToolbar={headerToolbar}
                buttonText={{
                    today: "Today",
                    timeGridDay: "Day",
                    timeGridWeek: "Week",
                    listMonth: "List",
                    dayGridMonth: "Month",
                    multiMonthYear: "Year"
                }}
                slotLabelFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                }}
                nowIndicator
                nowIndicatorContent
                now={new Date()}
                slotDuration="00:30:00"
                snapDuration="00:15:00"
                slotMinTime="00:00:00"
                slotMaxTime="24:00:00"
                eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                }}
                height="auto"
                expandRows
                stickyHeaderDates
                events={events}
                selectable
                editable
                eventStartEditable
                eventDurationEditable
                eventAllow={() => true}
                dateClick={handleDateSelect}
                eventClick={handleEventClick}
                eventChange={handleEventChange}
                eventDrop={handleEventChange}
                eventResize={handleEventChange}
                eventDisplay="block"
                eventContent={renderEventContent}
                noEventsContent="No events to display"
            />
        </div>
    );
}
