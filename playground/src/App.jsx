import { useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { ActionLog } from "./components/ActionLog";
import { Hero } from "./components/Hero";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import {
  createAction,
  createAssociationAttribute,
  createDataSource,
  createDatasourceAction,
  createListAttribute,
  createReadonlyListAttribute,
  createScalarAttribute,
  useActionLog,
} from "./mendixMocks";
import { CalendarPage } from "./pages/CalendarPage";
import { DataWidgetsPage } from "./pages/DataWidgetsPage";
import { FormWidgetsPage } from "./pages/FormWidgetsPage";

export default function App() {
  const log = useActionLog();
  const [isLogOpen, setIsLogOpen] = useState(false);

  const [boardRows] = useState([
    {
      id: "kpi-1",
      title: "ARR",
      value: "$1.01M",
      subtitle: "annualized",
      trendValue: "9%",
      trendDirection: "up",
    },
  ]);

  const [chartRows] = useState([
    { id: "1", label: "Pending", value: 20, color: "rgba(251, 191, 36, 0.78)" },
    { id: "2", label: "Approved", value: 45, color: "rgba(16, 185, 129, 0.78)" },
    { id: "3", label: "Rejected", value: 10, color: "rgba(248, 113, 113, 0.78)" },
    { id: "4", label: "Draft", value: 15, color: "rgba(96, 165, 250, 0.78)" },
  ]);

  const [mapRows] = useState([
    {
      id: "jakarta",
      title: "Jakarta Office",
      subtitle: "Main branch in Sudirman",
      latitude: -6.2088,
      longitude: 106.8456,
      color: "#2563eb",
    },
    {
      id: "bandung",
      title: "Bandung Hub",
      subtitle: "West Java support center",
      latitude: -6.9175,
      longitude: 107.6191,
      color: "#16a34a",
    },
    {
      id: "surabaya",
      title: "Surabaya Point",
      subtitle: "East Java operations",
      latitude: -7.2575,
      longitude: 112.7521,
      color: "#f97316",
    },
  ]);

  const [detailCardContext] = useState({
    eyebrow: "Booking summary",
    firstName: "Jordan",
    lastName: "Mercer",
    title: "Room Atlas",
    subtitle: "Strategy session with product and ops team",
    description:
      "A polished detail card for datasource-backed information with custom hero blocks and flexible detail rows.",
    value: "08:30",
    badge: "Confirmed",
  });

  const [employeeOptions] = useState([
    { id: "emp-1", name: "Andra Wijaya" },
    { id: "emp-2", name: "Rizki Hadi" },
    { id: "emp-3", name: "Nadia Putri" },
  ]);

  const [formState, setFormState] = useState({
    title: "",
    employee: null,
    startDate: new Date("2026-04-09T11:00:00"),
    endDate: new Date("2026-04-09T12:00:00"),
  });

  const [calendarContext, setCalendarContext] = useState({
    selectedDate: null,
    selectedEventId: "",
    selectedEventTitle: "",
    selectedEventStart: null,
    selectedEventEnd: null,
  });

  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: "evt-1",
      title: "Room Alpha - Respect",
      startDate: new Date("2026-04-09T11:00:00"),
      endDate: new Date("2026-04-09T12:00:00"),
      color: "#ff6368",
    },
    {
      id: "evt-2",
      title: "Room Beta - Border",
      startDate: new Date("2026-04-09T14:00:00"),
      endDate: new Date("2026-04-09T15:30:00"),
      color: "#2563eb",
    },
  ]);

  const employeeNameAttr = useMemo(
    () => createReadonlyListAttribute("name"),
    [employeeOptions],
  );

  const titleAttribute = createScalarAttribute(formState, setFormState, "title");
  const employeeAssociation = createAssociationAttribute(formState, setFormState, "employee");
  const startDateAttribute = createScalarAttribute(formState, setFormState, "startDate");
  const endDateAttribute = createScalarAttribute(formState, setFormState, "endDate");

  const calendarTitleAttr = createListAttribute(setCalendarEvents, "title");
  const calendarStartAttr = createListAttribute(setCalendarEvents, "startDate");
  const calendarEndAttr = createListAttribute(setCalendarEvents, "endDate");
  const calendarColorAttr = createListAttribute(setCalendarEvents, "color");

  const selectedDateAttr = createScalarAttribute(calendarContext, setCalendarContext, "selectedDate");
  const selectedEventIdAttr = createScalarAttribute(calendarContext, setCalendarContext, "selectedEventId");
  const selectedEventTitleAttr = createScalarAttribute(calendarContext, setCalendarContext, "selectedEventTitle");
  const selectedEventStartAttr = createScalarAttribute(calendarContext, setCalendarContext, "selectedEventStart");
  const selectedEventEndAttr = createScalarAttribute(calendarContext, setCalendarContext, "selectedEventEnd");

  const boardDataSource = createDataSource(boardRows);
  const chartDataSource = createDataSource(chartRows);
  const mapDataSource = createDataSource(mapRows);
  const employeeDataSource = createDataSource(employeeOptions);
  const calendarEventSource = createDataSource(calendarEvents);

  const boardTitleAttr = createReadonlyListAttribute("title");
  const boardValueAttr = createReadonlyListAttribute("value");
  const boardSubtitleAttr = createReadonlyListAttribute("subtitle");
  const boardTrendValueAttr = createReadonlyListAttribute("trendValue");
  const boardTrendDirectionAttr = createReadonlyListAttribute("trendDirection");

  const chartLabelAttr = createReadonlyListAttribute("label");
  const chartValueAttr = createReadonlyListAttribute("value");
  const chartColorAttr = createReadonlyListAttribute("color");

  const mapLatitudeAttr = createReadonlyListAttribute("latitude");
  const mapLongitudeAttr = createReadonlyListAttribute("longitude");
  const mapTitleAttr = createReadonlyListAttribute("title");
  const mapSubtitleAttr = createReadonlyListAttribute("subtitle");
  const mapColorAttr = createReadonlyListAttribute("color");
  const noopSetDetailCardContext = () => {};
  const detailCardEyebrowAttr = createScalarAttribute(detailCardContext, noopSetDetailCardContext, "eyebrow", { readOnly: true });
  const detailCardFirstNameAttr = createScalarAttribute(detailCardContext, noopSetDetailCardContext, "firstName", { readOnly: true });
  const detailCardLastNameAttr = createScalarAttribute(detailCardContext, noopSetDetailCardContext, "lastName", { readOnly: true });
  const detailCardTitleAttr = createScalarAttribute(detailCardContext, noopSetDetailCardContext, "title", { readOnly: true });
  const detailCardSubtitleAttr = createScalarAttribute(detailCardContext, noopSetDetailCardContext, "subtitle", { readOnly: true });
  const detailCardDescriptionAttr = createScalarAttribute(detailCardContext, noopSetDetailCardContext, "description", { readOnly: true });
  const detailCardValueAttr = createScalarAttribute(detailCardContext, noopSetDetailCardContext, "value", { readOnly: true });
  const detailCardBadgeAttr = createScalarAttribute(detailCardContext, noopSetDetailCardContext, "badge", { readOnly: true });

  const formSubmitAction = createAction(() => {
    log.push("Form Submit", {
      title: formState.title,
      employee: formState.employee ? formState.employee.name : null,
      startDate: formState.startDate,
      endDate: formState.endDate,
    });
  });

  const datepickerChangeAction = createAction(() => {
    log.push("Datepicker Change", {
      startDate: formState.startDate,
      endDate: formState.endDate,
    });
  });

  const inputChangeAction = createAction(() => {
    log.push("Input Change", { title: formState.title });
  });

  const selectChangeAction = createAction(() => {
    log.push("Select Change", {
      employee: formState.employee ? formState.employee.name : null,
    });
  });

  const onDateSelectAction = createAction((variables) => {
    log.push("Calendar Date Select", variables);
  });

  const onEventClickAction = createDatasourceAction((item) => {
    log.push("Calendar Event Click", item);
  });

  const onEventChangeAction = createDatasourceAction((item, variables) => {
    log.push("Calendar Event Change", {
      item,
      variables,
      context: calendarContext,
    });
  });

  const typographEditAction = createAction(() => {
    log.push("Typograph Edit", {
      title: "tostx",
      category: "Respect",
    });
  });

  const typographDeleteAction = createAction(() => {
    log.push("Typograph Delete", {
      title: "tostx",
      category: "Respect",
    });
  });

  const formPageProps = {
    formState,
    setFormState,
    titleAttribute,
    employeeAssociation,
    employeeDataSource,
    employeeNameAttr,
    startDateAttribute,
    endDateAttribute,
    formSubmitAction,
    inputChangeAction,
    selectChangeAction,
    datepickerChangeAction,
    createAction,
  };

  const calendarPageProps = {
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
  };

  const dataPageProps = {
    boardDataSource,
    boardTitleAttr,
    boardValueAttr,
    boardSubtitleAttr,
    boardTrendValueAttr,
    boardTrendDirectionAttr,
    chartDataSource,
    chartLabelAttr,
    chartValueAttr,
    chartColorAttr,
    mapDataSource,
    mapLatitudeAttr,
    mapLongitudeAttr,
    mapTitleAttr,
    mapSubtitleAttr,
    mapColorAttr,
    detailCardEyebrowAttr,
    detailCardFirstNameAttr,
    detailCardLastNameAttr,
    detailCardTitleAttr,
    detailCardSubtitleAttr,
    detailCardDescriptionAttr,
    detailCardValueAttr,
    detailCardBadgeAttr,
    typographEditAction,
    typographDeleteAction,
  };

  return (
    <div className="playground-app">
      <Topbar />

      <div className="playground-shell">
        <Sidebar />

        <div className="playground-content">
          <Hero />

          <div className="playground-layout">
            <main className="playground-main">
              <Routes>
                <Route path="/" element={<Navigate to="/form" replace />} />
                <Route path="/form" element={<FormWidgetsPage {...formPageProps} />} />
                <Route path="/calendar" element={<CalendarPage {...calendarPageProps} />} />
                <Route path="/data" element={<DataWidgetsPage {...dataPageProps} />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>

      {isLogOpen ? (
        <ActionLog log={log} onMinimize={() => setIsLogOpen(false)} />
      ) : (
        <button
          type="button"
          className="playground-log-fab"
          onClick={() => setIsLogOpen(true)}
        >
          <span className="playground-log-fab__dot" />
          Open live log
        </button>
      )}
    </div>
  );
}
