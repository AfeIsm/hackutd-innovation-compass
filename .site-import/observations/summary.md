# Home page comparison

Source: https://hack-utd.vercel.app/
Preview: http://localhost:8080/

## Results
- Desktop 1280×1800 and phone 390×844: header, main content, health-score graphic, and footer match paired screenshots and measured bounds.
- Document is the scrolling container. Desktop fits exactly in the viewport; phone scrolls to 243px, revealing the full graphic and footer, then returns to the top.
- Header has no scroll-dependent class/state changes. Phone uses the same visible account links, without a hamburger menu or nested navigation.
- Brand link, Log in, header Get started, and main Get started preserve preview-origin destinations at both sizes; screenshots and results are recorded in ledger.json.
- /login and /signup are not imported, as only the home page was requested. They currently show the preview's not-found page. Source destinations were observed without submitting credentials or forms.
- No popups, menus, accordions, tabs, carousels, video, canvas, or hero motion were present on the requested page. No static media substitutions or normal-flow repairs were needed.
- All 11 captured assets are fonts and were downloaded by the importer. No assets were unavailable.
- No browser page errors during the home-page comparison. Existing routing test passed. Latest build signal: build OK.

## Evidence
ledger.json contains source and preview section bounds, text, scroll positions, controls, and destination checks. Paired desktop/phone top and bottom screenshots are in this directory.