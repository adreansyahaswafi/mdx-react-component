import { createElement } from "react";

import { EdtsProfileDropDown } from "@packages/edtsProfileDropDown/src/EdtsProfileDropDown";

export function Topbar() {
  return (
    <header className="playground-topbar">
      <div className="playground-topbar__brand">
        <span className="playground-topbar__spark" />
        <div>
          <div className="playground-topbar__eyebrow">EDTS Mendix Widgets</div>
          <div className="playground-topbar__title">Playground Canvas</div>
        </div>
      </div>
      <div className="playground-topbar__status">
        <div className="playground-topbar__pill-group">
          <span className="playground-topbar__pill">React 18</span>
          <span className="playground-topbar__pill">Vite</span>
          <span className="playground-topbar__pill">Router</span>
          <span className="playground-topbar__pill playground-topbar__pill--soft">
            Mock Mendix Props
          </span>
        </div>
        <EdtsProfileDropDown
          avatarText="AA"
          displayName="Adreansyah Aswafi"
          email="adreansyah@edts.dev"
          roleLabel="Widget Architect"
          statusLabel="Available"
          primaryActionCaption="Profile details"
          secondaryActionCaption="Workspace settings"
          logoutCaption="Sign out"
          content={
            <div className="playground-topbar__profile-note">
              <div className="playground-topbar__profile-note-title">Current Space</div>
              <div className="playground-topbar__profile-note-text">
                Booking Room widgets monorepo with playground preview.
              </div>
            </div>
          }
        />
      </div>
    </header>
  );
}
