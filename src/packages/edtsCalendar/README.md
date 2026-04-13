# EdtsCalendar

A FullCalendar integration widget for Mendix that provides advanced calendar functionality with event management capabilities.

## Features

- **Full Calendar View**: Display events in month, week, and day views
- **Event Management**: Bind to Mendix entities for dynamic event data
- **Customizable**: Configure event attributes and appearance
- **Interactive**: Support for event creation, editing, and deletion
- **Responsive**: Works on desktop and mobile devices

## Requirements

- Mendix 9.12.0 or higher
- Node.js 16 or higher for development

## Usage

1. Add the EdtsCalendar widget to your page
2. Configure the data source by selecting an entity
3. Map the title and start date attributes
4. Optionally configure end date, description, and other event properties
5. Run the application to see the calendar with your events

## Properties

- **Event Source**: Data source entity containing calendar events
- **Title Attribute**: Attribute to use for event titles
- **Start Date Attribute**: Attribute for event start dates
- **End Date Attribute**: Optional attribute for event end dates
- **Description Attribute**: Optional attribute for event descriptions

## Development

To set up a development environment:

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`
4. Run linting: `npm run lint`

## Issues and Support

For issues, questions, or feature requests, please visit our [GitHub repository](https://github.com/edts-mendix/edtscalendar).

## License

Apache License 2.0
