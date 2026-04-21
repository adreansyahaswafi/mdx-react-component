export const sidebarSections = [
  {
    title: "Form",
    items: [
      { to: "/widgets/input", label: "EdtsInput", meta: "Text, password, validation" },
      { to: "/widgets/input-color-picker", label: "EdtsInputColorPicker", meta: "Hex color picker and swatch" },
      { to: "/widgets/radio-button", label: "EdtsRadioButton", meta: "Configurable radio group" },
      { to: "/widgets/input-datepicker", label: "EdtsInputDatepicker", meta: "Input-style date and time picker" },
      { to: "/widgets/select-box", label: "EdtsSelectBox", meta: "React-select style selector" },
      { to: "/widgets/datepicker", label: "EdtsDatepicker", meta: "Date and time range picker" },
      { to: "/widgets/button", label: "EdtsButton", meta: "Bootstrap-based action button" },
      { to: "/widgets/form", label: "EdtsForm", meta: "Wrapper form with footer actions" },
      { to: "/widgets/form-login", label: "EdtsFormLogin", meta: "Login wrapper with toast flow" },
    ],
  },
  {
    title: "Scheduling",
    items: [{ to: "/widgets/calendar", label: "EdtsCalendar", meta: "Day, week, month, drag events" }],
  },
  {
    title: "Data",
    items: [
      { to: "/widgets/data-table", label: "EdtsDataTable", meta: "Search, sort, filter, field picker" },
      { to: "/widgets/board-information", label: "EdtsBoardInformation", meta: "KPI summary card" },
      { to: "/widgets/chart-graph", label: "EdtsChartGraph", meta: "Apex chart visual" },
      { to: "/widgets/map-leaflet", label: "EdtsMapLeaflet", meta: "Leaflet map widget" },
      { to: "/widgets/typograph", label: "EdtsTypograph", meta: "Detail body typograph card" },
      { to: "/widgets/detail-card", label: "EdtsDetailCard", meta: "Datasource detail summary" },
      { to: "/widgets/profile-dropdown", label: "EdtsProfileDropDown", meta: "Avatar dropdown profile menu" },
    ],
  },
  {
    title: "Layout",
    items: [
      { to: "/widgets/sidebar", label: "EdtsSidebar", meta: "Sidebar, header, navigation list" },
    ],
  },
];

export const defaultWidgetRoute = sidebarSections[0].items[0].to;
