import { useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { EdtsBoardInformation } from "@packages/edtsBoardInformation/src/EdtsBoardInformation";
import { EdtsButton } from "@packages/edtsButton/src/EdtsButton";
import { EdtsCalendar } from "@packages/edtsCalendar/src/EdtsCalendar";
import { EdtsChartGraph } from "@packages/edtsChartGraph/src/EdtsChartGraph";
import { EdtsDataTable } from "@packages/edtsDataTable/src/EdtsDataTable";
import { EdtsDetailCard } from "@packages/edtsDetailCard/src/EdtsDetailCard";
import { EdtsForm } from "@packages/edtsForm/src/EdtsForm";
import { EdtsFormLogin } from "@packages/edtsFormLogin/src/EdtsFormLogin";
import { EdtsInput } from "@packages/edtsInput/src/EdtsInput";
import { EdtsInputColorPicker } from "@packages/edtsInputColorPicker/src/EdtsInputColorPicker";
import { EdtsInputDatepicker } from "@packages/edtsInputDatepicker/src/EdtsInputDatepicker";
import { EdtsMapLeaflet } from "@packages/edtsMapLeaflet/src/EdtsMapLeaflet";
import { EdtsProfileDropDown } from "@packages/edtsProfileDropDown/src/EdtsProfileDropDown";
import { EdtsRadioButton } from "@packages/edtsRadioButton/src/EdtsRadioButton";
import { EdtsSelectBox } from "@packages/edtsSelectBox/src/EdtsSelectBox";
import { EdtsSidebar } from "@packages/edtsSidebar/src/EdtsSidebar";
import { EdtsTypograph } from "@packages/edtsTypograph/src/EdtsTypograph";
import { Datepicker } from "@packages/edtsdatepicker/src/Datepicker";

import { ActionLog } from "./components/ActionLog";
import { Hero } from "./components/Hero";
import { Sidebar } from "./components/Sidebar";
import { defaultWidgetRoute } from "./components/sidebarConfig";
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
import { WidgetPage } from "./pages/WidgetPage";

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

  const [tableRows] = useState([
    {
      id: "row-1",
      bookingCode: "BR-2401",
      owner: "Jordan Mercer",
      room: "Atlas 8A",
      status: "Confirmed",
      date: new Date("2026-04-13T09:00:00"),
      attendees: 8,
    },
    {
      id: "row-2",
      bookingCode: "BR-2402",
      owner: "Ayu Pratama",
      room: "Orion 3C",
      status: "Pending",
      date: new Date("2026-04-13T11:30:00"),
      attendees: 4,
    },
    {
      id: "row-3",
      bookingCode: "BR-2403",
      owner: "Rizki Hadi",
      room: "Atlas 8A",
      status: "Confirmed",
      date: new Date("2026-04-14T14:00:00"),
      attendees: 12,
    },
    {
      id: "row-4",
      bookingCode: "BR-2404",
      owner: "Nadia Putri",
      room: "Zenith 2B",
      status: "Draft",
      date: new Date("2026-04-15T08:30:00"),
      attendees: 3,
    },
    {
      id: "row-5",
      bookingCode: "BR-2405",
      owner: "Dimas Kurnia",
      room: "Orion 3C",
      status: "Cancelled",
      date: new Date("2026-04-16T16:00:00"),
      attendees: 6,
    },
    {
      id: "row-6",
      bookingCode: "BR-2406",
      owner: "Salma Nabila",
      room: "Horizon 5F",
      status: "Confirmed",
      date: new Date("2026-04-17T10:15:00"),
      attendees: 9,
    },
  ]);

  const [employeeOptions] = useState([
    { id: "emp-1", name: "Andra Wijaya" },
    { id: "emp-2", name: "Rizki Hadi" },
    { id: "emp-3", name: "Nadia Putri" },
  ]);

  const [formState, setFormState] = useState({
    title: "",
    themeColor: "#2563EB",
    bookingMode: "room",
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
  const themeColorAttribute = createScalarAttribute(formState, setFormState, "themeColor");
  const bookingModeAttribute = createScalarAttribute(formState, setFormState, "bookingMode");
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
  const tableDataSource = createDataSource(tableRows);
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
  const tableCodeAttr = createReadonlyListAttribute("bookingCode");
  const tableOwnerAttr = createReadonlyListAttribute("owner");
  const tableRoomAttr = createReadonlyListAttribute("room");
  const tableStatusAttr = createReadonlyListAttribute("status");
  const tableDateAttr = createReadonlyListAttribute("date");
  const tableAttendeesAttr = createReadonlyListAttribute("attendees");

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
    log.push("Input Change", {
      title: formState.title,
      themeColor: formState.themeColor,
    });
  });

  const selectChangeAction = createAction(() => {
    log.push("Select Change", {
      employee: formState.employee ? formState.employee.name : null,
    });
  });

  const radioChangeAction = createAction(() => {
    log.push("Radio Change", {
      bookingMode: formState.bookingMode,
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
  const buttonClickAction = createAction(() => {
    log.push("Button Click", { caption: "Masuk", variant: "primary" });
  });

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
                <Route path="/" element={<Navigate to={defaultWidgetRoute} replace />} />
                <Route
                  path="/widgets/input"
                  element={
                    <WidgetPage
                      eyebrow="Form widget"
                      title="EdtsInput"
                      description="Single input preview with Mendix-style attribute binding and validation."
                    >
                      <EdtsInput
                        valueAttribute={titleAttribute}
                        label="Meeting title"
                        placeholder="Enter a meeting title"
                        helperText="Use a concise title for the booking."
                        inputType="text"
                        required
                        requiredMessage="Meeting title is required."
                        validateOnChange
                        onChangeAction={inputChangeAction}
                      />
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/input-color-picker"
                  element={
                    <WidgetPage
                      eyebrow="Form widget"
                      title="EdtsInputColorPicker"
                      description="Native color picker with editable hex input, Mendix-style binding, and inline validation."
                    >
                      <EdtsInputColorPicker
                        valueAttribute={themeColorAttribute}
                        label="Theme color"
                        placeholder="#2563eb"
                        helperText="Choose a primary color for cards, charts, or status accents."
                        defaultColor="#2563eb"
                        required
                        requiredMessage="Theme color is required."
                        invalidColorMessage="Use a valid hex color like #2563eb."
                        validateOnChange
                        onChangeAction={inputChangeAction}
                      />
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/radio-button"
                  element={
                    <WidgetPage
                      eyebrow="Form widget"
                      title="EdtsRadioButton"
                      description="Single-choice radio group with helper text and Mendix attribute binding."
                    >
                      <EdtsRadioButton
                        valueAttribute={bookingModeAttribute}
                        label="Booking mode"
                        helperText="Choose how this booking should be handled."
                        layout="vertical"
                        required
                        requiredMessage="Please choose one booking mode."
                        validateOnChange
                        onChangeAction={radioChangeAction}
                        options={[
                          {
                            label: "Meeting room",
                            value: "room",
                            description: "Use a physical room booking with date and time."
                          },
                          {
                            label: "Online meeting",
                            value: "online",
                            description: "Use this when the session will run remotely."
                          },
                          {
                            label: "Hybrid session",
                            value: "hybrid",
                            description: "Reserve the room and support a remote audience."
                          }
                        ]}
                      />
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/select-box"
                  element={
                    <WidgetPage
                      eyebrow="Form widget"
                      title="EdtsSelectBox"
                      description="Association-driven select box with clear, search, and validation states."
                    >
                      <EdtsSelectBox
                        selectType="association"
                        associationValue={employeeAssociation}
                        valueAttribute={null}
                        optionsSource={employeeDataSource}
                        optionLabelAttr={employeeNameAttr}
                        label="Employee"
                        placeholder="Select employee"
                        helperText="Pick the booking owner."
                        isClearable
                        isSearchable
                        required
                        requiredMessage="Employee is required."
                        validateOnChange
                        onChangeAction={selectChangeAction}
                      />
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/input-datepicker"
                  element={
                    <WidgetPage
                      eyebrow="Form widget"
                      title="EdtsInputDatepicker"
                      description="Single date or datetime picker styled to match the EdtsInput family."
                    >
                      <EdtsInputDatepicker
                        valueAttribute={startDateAttribute}
                        minDateAttribute={null}
                        maxDateAttribute={null}
                        label="Meeting date"
                        placeholder="Choose a meeting date"
                        helperText="Pick the booking start date and time."
                        selectionMode="datetime"
                        dateFormatPattern="dd MMM yyyy HH:mm"
                        showCalendarIcon
                        showMonthDropdown
                        showYearDropdown
                        allowClear
                        validateOnChange
                        onChangeAction={datepickerChangeAction}
                      />
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/datepicker"
                  element={
                    <WidgetPage
                      eyebrow="Form widget"
                      title="EdtsDatepicker"
                      description="Date and time range picker with editable time slots."
                    >
                      <Datepicker
                        dateAttribute={startDateAttribute}
                        endDateAttribute={endDateAttribute}
                        pickerMode="range"
                        labelCaption="Selected date"
                        placeholderText="Choose start"
                        endPlaceholderText="Choose end"
                        helperText="Date is locked after selection, but time stays editable."
                        dateFormatPattern="dd MMM yyyy"
                        showCalendarIcon
                        allowClear
                        dateReadOnly={false}
                        disabled={false}
                        onChangeAction={datepickerChangeAction}
                      />
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/button"
                  element={
                    <WidgetPage
                      eyebrow="Action widget"
                      title="EdtsButton"
                      description="Bootstrap-based button styles with icon, loading, and width variations."
                    >
                      <div className="playground-button-stack">
                        <EdtsButton
                          caption="Masuk"
                          leftIcon="login"
                          variant="primary"
                          size="md"
                          buttonType="button"
                          onClickAction={buttonClickAction}
                        />
                        <EdtsButton
                          caption="Outline"
                          leftIcon="search"
                          variant="primary"
                          outline
                          size="md"
                          buttonType="button"
                          onClickAction={buttonClickAction}
                        />
                        <EdtsButton
                          caption="Full Width"
                          leftIcon="check"
                          variant="success"
                          size="lg"
                          fullWidth
                          buttonType="button"
                          onClickAction={buttonClickAction}
                        />
                      </div>
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/form"
                  element={
                    <WidgetPage
                      eyebrow="Wrapper widget"
                      title="EdtsForm"
                      description="Form wrapper with footer controls, divider, and content slot styling."
                    >
                      <EdtsForm
                        title="Create Booking"
                        description="Try validation, selection, and date range interactions directly in the browser."
                        submitCaption="Submit Booking"
                        cancelCaption="Reset"
                        showCancelButton
                        showFooter
                        compact={false}
                        submitOnEnter
                        onSubmitAction={formSubmitAction}
                        onCancelAction={createAction(() => {
                          setFormState({
                            title: "",
                            bookingMode: "room",
                            employee: null,
                            startDate: new Date("2026-04-09T11:00:00"),
                            endDate: new Date("2026-04-09T12:00:00"),
                          });
                        })}
                        content={
                          <div className="playground-form-stack">
                            <EdtsInput
                              valueAttribute={titleAttribute}
                              label="Meeting title"
                              placeholder="Enter a meeting title"
                              helperText="Use a concise title for the booking."
                              inputType="text"
                              required
                              requiredMessage="Meeting title is required."
                              validateOnChange
                              onChangeAction={inputChangeAction}
                            />
                            <EdtsSelectBox
                              selectType="association"
                              associationValue={employeeAssociation}
                              valueAttribute={null}
                              optionsSource={employeeDataSource}
                              optionLabelAttr={employeeNameAttr}
                              label="Employee"
                              placeholder="Select employee"
                              helperText="Pick the booking owner."
                              isClearable
                              isSearchable
                              required
                              requiredMessage="Employee is required."
                              validateOnChange
                              onChangeAction={selectChangeAction}
                            />
                            <EdtsRadioButton
                              valueAttribute={bookingModeAttribute}
                              label="Booking mode"
                              helperText="Choose whether this booking is room, online, or hybrid."
                              required
                              requiredMessage="Booking mode is required."
                              validateOnChange
                              onChangeAction={radioChangeAction}
                              options={[
                                {
                                  label: "Meeting room",
                                  value: "room",
                                  description: "Use a physical room booking with date and time."
                                },
                                {
                                  label: "Online meeting",
                                  value: "online",
                                  description: "Use this when the session will run remotely."
                                },
                                {
                                  label: "Hybrid session",
                                  value: "hybrid",
                                  description: "Reserve the room and support a remote audience."
                                }
                              ]}
                            />
                            <Datepicker
                              dateAttribute={startDateAttribute}
                              endDateAttribute={endDateAttribute}
                              pickerMode="range"
                              labelCaption="Selected date"
                              placeholderText="Choose start"
                              endPlaceholderText="Choose end"
                              helperText="Date is locked after selection, but time stays editable."
                              dateFormatPattern="dd MMM yyyy"
                              showCalendarIcon
                              allowClear
                              dateReadOnly={false}
                              disabled={false}
                              onChangeAction={datepickerChangeAction}
                            />
                          </div>
                        }
                      />
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/form-login"
                  element={
                    <WidgetPage
                      eyebrow="Wrapper widget"
                      title="EdtsFormLogin"
                      description="Login-focused wrapper with submit-on-enter and toast-ready flow."
                    >
                      <EdtsFormLogin
                        showHeader={false}
                        title="Login"
                        description="Login-style wrapper dengan tombol utama center di bawah."
                        submitCaption="Login"
                        showSecondaryButton={false}
                        submitOnEnter
                        showToastOnSubmit
                        toastMessage=""
                        toastType="error"
                        toastPosition="topRight"
                        toastAutoClose={2400}
                        onSubmitAction={formSubmitAction}
                        content={
                          <div className="playground-form-stack">
                            <EdtsInput
                              valueAttribute={titleAttribute}
                              label="Username"
                              placeholder="Masukkan username"
                              helperText="Demo memakai attribute title yang sama dari playground."
                              inputType="text"
                              required
                              requiredMessage="Username is required."
                              validateOnChange
                              onChangeAction={inputChangeAction}
                            />
                            <EdtsInput
                              valueAttribute={titleAttribute}
                              label="Password"
                              placeholder="Masukkan password"
                              inputType="password"
                              required
                              requiredMessage="Password is required."
                              validateOnChange
                              onChangeAction={inputChangeAction}
                            />
                          </div>
                        }
                      />
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/calendar"
                  element={
                    <WidgetPage
                      eyebrow="Scheduling widget"
                      title="EdtsCalendar"
                      description="Drag, resize, click dates, and inspect the mirrored selected context."
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
                          <div className="playground-context-card__title">Current context mirrors</div>
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
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/data-table"
                  element={
                    <WidgetPage
                      eyebrow="Data widget"
                      title="EdtsDataTable"
                      description="Searchable table with sortable headers, distinct-value filters, and field visibility toggles."
                    >
                      <EdtsDataTable
                        dataSource={tableDataSource}
                        title="Booking requests"
                        description="Filter by room or status, search across searchable columns, and hide or reveal fields from the field picker."
                        showSearch
                        showFilters
                        showFieldPicker
                        rowsPerPage={4}
                        stickyHeader
                        striped
                        onRowClick={createDatasourceAction((item) => {
                          log.push("DataTable Row Click", item);
                        })}
                        fields={[
                          {
                            header: "Code",
                            valueAttr: tableCodeAttr,
                            align: "left",
                            sortable: true,
                            searchable: true,
                            filterable: false,
                          },
                          {
                            header: "Owner",
                            valueAttr: tableOwnerAttr,
                            align: "left",
                            sortable: true,
                            searchable: true,
                            showFilter: true,
                            filterType: "select",
                          },
                          {
                            header: "Room",
                            valueAttr: tableRoomAttr,
                            align: "left",
                            sortable: true,
                            searchable: true,
                            showFilter: true,
                            filterType: "select",
                          },
                          {
                            header: "Status",
                            valueAttr: tableStatusAttr,
                            align: "center",
                            sortable: true,
                            searchable: true,
                            showFilter: true,
                            filterType: "select",
                          },
                          {
                            header: "Date",
                            valueAttr: tableDateAttr,
                            align: "left",
                            sortable: true,
                            searchable: true,
                            showFilter: true,
                            filterType: "date",
                          },
                          {
                            header: "Attendees",
                            valueAttr: tableAttendeesAttr,
                            align: "right",
                            sortable: true,
                            searchable: false,
                            showFilter: true,
                            filterType: "select",
                          },
                        ]}
                      />
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/board-information"
                  element={
                    <WidgetPage
                      eyebrow="Data widget"
                      title="EdtsBoardInformation"
                      description="Compact KPI card with title, value, subtitle, and trend direction."
                    >
                      <EdtsBoardInformation
                        dataSource={boardDataSource}
                        titleAttr={boardTitleAttr}
                        valueAttr={boardValueAttr}
                        subtitleAttr={boardSubtitleAttr}
                        trendValueAttr={boardTrendValueAttr}
                        trendDirectionAttr={boardTrendDirectionAttr}
                        fallbackTrendDirection="up"
                        theme="dark"
                      />
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/chart-graph"
                  element={
                    <WidgetPage
                      eyebrow="Data widget"
                      title="EdtsChartGraph"
                      description="Chart preview with live mock series and color mapping."
                    >
                      <EdtsChartGraph
                        dataSource={chartDataSource}
                        labelAttr={chartLabelAttr}
                        valueAttr={chartValueAttr}
                        colorAttr={chartColorAttr}
                        chartTitle="Approval Pipeline"
                        chartSubtitle="Live browser preview"
                        seriesName="Requests"
                        chartType="bar"
                        height={340}
                        showLegend
                        showToolbar={false}
                        showDataLabels={false}
                        useSmoothCurve
                      />
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/map-leaflet"
                  element={
                    <WidgetPage
                      eyebrow="Data widget"
                      title="EdtsMapLeaflet"
                      description="Leaflet map with marker dataset and popup previews."
                    >
                      <div className="playground-map-shell">
                        <EdtsMapLeaflet
                          dataSource={mapDataSource}
                          latitudeAttr={mapLatitudeAttr}
                          longitudeAttr={mapLongitudeAttr}
                          titleAttr={mapTitleAttr}
                          subtitleAttr={mapSubtitleAttr}
                          colorAttr={mapColorAttr}
                          mapHeight={420}
                          initialZoom={6}
                          allowScrollWheelZoom
                          showPopupOnLoad
                        />
                      </div>
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/typograph"
                  element={
                    <WidgetPage
                      eyebrow="Data widget"
                      title="EdtsTypograph"
                      description="Readable detail typography block for booking information."
                    >
                      <div className="playground-typograph-shell">
                        <EdtsTypograph
                          title="tostx"
                          scheduleText="Friday, 10 April 2026 04:30 – 05:30"
                          detailItems={[
                            {
                              iconContent: <span aria-hidden="true">◆</span>,
                              content: <strong>Respect</strong>,
                            },
                            {
                              iconContent: <span aria-hidden="true">●</span>,
                              content: (
                                <span>
                                  Adreansyah Aswafi <strong>( PT ASIK BANGET )</strong>
                                </span>
                              ),
                            },
                          ]}
                          variant="lined"
                          accentColor="#14236f"
                          showActions
                          onEdit={typographEditAction}
                          onDelete={typographDeleteAction}
                        />
                      </div>
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/detail-card"
                  element={
                    <WidgetPage
                      eyebrow="Data widget"
                      title="EdtsDetailCard"
                      description="Object-based detail summary card with image, meta, and row details."
                    >
                      <div className="playground-detail-card-shell">
                        <EdtsDetailCard
                          eyebrowAttr={detailCardEyebrowAttr}
                          firstNameAttr={detailCardFirstNameAttr}
                          lastNameAttr={detailCardLastNameAttr}
                          titleAttr={detailCardTitleAttr}
                          subtitleAttr={detailCardSubtitleAttr}
                          descriptionAttr={detailCardDescriptionAttr}
                          valueAttr={detailCardValueAttr}
                          badgeAttr={detailCardBadgeAttr}
                          imageUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                          variant="soft"
                          accentColor="#2563eb"
                          detailItems={[
                            { label: "Owner", text: "Jordan Mercer" },
                            { label: "Room", text: "Atlas 8A" },
                            { label: "Duration", text: "90 minutes" },
                          ]}
                        />
                      </div>
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/profile-dropdown"
                  element={
                    <WidgetPage
                      eyebrow="Data widget"
                      title="EdtsProfileDropDown"
                      description="Compact trigger with dropdown panel and quick actions."
                    >
                      <div className="playground-profile-stage">
                        <EdtsProfileDropDown
                          avatarImageUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                          firstName="Adreansyah"
                          lastName="Aswafi"
                          email="adreansyah@edts.dev"
                          roleLabel="Widget Architect"
                          primaryActionCaption="Profile"
                          logoutCaption="Sign out"
                          onPrimaryAction={createAction(() => log.push("Profile Action", { source: "profile dropdown" }))}
                          onLogoutAction={createAction(() => log.push("Logout Action", { source: "profile dropdown" }))}
                        />
                      </div>
                    </WidgetPage>
                  }
                />
                <Route
                  path="/widgets/sidebar"
                  element={
                    <WidgetPage
                      eyebrow="Layout widget"
                      title="EdtsSidebar"
                      description="Fixed sidebar and header chrome. Keep the page body in the Mendix layout Main placeholder."
                    >
                      <EdtsSidebar
                        brandName="EDTS"
                        logoText="EDTS"
                        variant="blue"
                        profileContent={
                          <EdtsProfileDropDown
                            avatarText="AS"
                            firstName="Adreansyah"
                            lastName="Aswafi"
                            email="adreansyah@edts.dev"
                            roleLabel="Administrator"
                            primaryActionCaption="Profile"
                            logoutCaption="Sign out"
                            compact
                            align="right"
                            onPrimaryAction={createAction(() => log.push("Sidebar Profile Action", { source: "sidebar" }))}
                            onLogoutAction={createAction(() => log.push("Sidebar Logout Action", { source: "sidebar" }))}
                          />
                        }
                      />
                    </WidgetPage>
                  }
                />
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
