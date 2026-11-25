# Ticket Dashboard

A Tampermonkey userscript that shows open and pending Freshservice tickets per tech, grouped by team, using your own logged-in Freshservice session. No API key.

## Install
1. Install Tampermonkey (Chrome Web Store or Edge Add-ons). In Chrome, turn on **Allow User Scripts** in the extension's Details page.
2. Open https://raw.githubusercontent.com/Ads-NJ-IT/ticket-dashboard/main/ticket-dashboard.user.js and click **Install**.
3. Go to https://adsofnjinc.freshservice.com/a/ticket-dashboard while logged in to Freshservice.
4. Optional: install the page as an app (Edge: Apps > Install this site as an app. Chrome: Cast, save and share > Create shortcut > Open as window).

## Settings
Settings (top right) holds the refresh interval, color limits, and which team each tech is on (US, PH or Hidden). Settings are saved per browser. Use **Copy settings** and **Paste settings** to move a setup to another computer.

## How it works
Each refresh reads all Open, Pending and Pending Customer Reply tickets in the My Team workspace, 100 per call (about 6 calls), through the same endpoints the Freshservice website uses. It only reads. Nothing is sent anywhere except Freshservice.

## Updating
Raise `@version` in the script header and push. Tampermonkey picks up the new version on its next update check (daily, or Tampermonkey > Utilities > Check for userscript updates).
