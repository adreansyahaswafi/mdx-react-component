import { createElement } from "react";

import { EdtsBoardInformation } from "@packages/edtsBoardInformation/src/EdtsBoardInformation";
import { EdtsChartGraph } from "@packages/edtsChartGraph/src/EdtsChartGraph";
import { EdtsDetailCard } from "@packages/edtsDetailCard/src/EdtsDetailCard";
import { EdtsMapLeaflet } from "@packages/edtsMapLeaflet/src/EdtsMapLeaflet";
import { EdtsTypograph } from "@packages/edtsTypograph/src/EdtsTypograph";

import { Section } from "../components/Section";

export function DataWidgetsPage(props) {
  const {
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
  } = props;

  return (
    <Section
      eyebrow="Data widgets"
      title="Board, Chart, and Map"
      description="Static demo datasets let you preview the dashboard widgets quickly."
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
            {
              iconContent: <span aria-hidden="true">↗</span>,
              content: <span>Follow up with room service and equipment team</span>,
            },
          ]}
          variant="lined"
          accentColor="#14236f"
          showActions
          onEdit={typographEditAction}
          onDelete={typographDeleteAction}
        />
      </div>

      <div className="playground-data-grid">
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
      </div>
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
            {
              label: "Participants",
              iconText: "👥",
              text: "Product, Ops, and Design stakeholders",
            },
            {
              label: "Equipment",
              iconText: "🖥",
              text: "Projector, Zoom screen, and wireless mic",
            },
            {
              label: "Notes",
              iconText: "✦",
              text: "Keep room setup in boardroom layout before 08:00",
            },
          ]}
        />
      </div>
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
    </Section>
  );
}
