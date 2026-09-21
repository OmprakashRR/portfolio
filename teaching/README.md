# Sustainable Construction Lab

The public entry point is `teaching/index.html`, linked from the portfolio's Teaching section and footer. All links are relative so GitHub Pages' `/portfolio/` project path works without a build step.

Activities:
- `building-massing.html`: fixed-area plan geometry, envelope area, and illustrative daylight/ventilation checks.
- `thermal-mass.html`: lumped room heat-capacity comparison, solar input, shading and night ventilation, with a worksheet.
- `shading-ventilation.html`: overhang shadow geometry, solar gains, wind-driven airflow, and a first-step energy balance.
- `summer-heat-gain.html`: the separate 24°C indoor / 30°C outdoor board example, printable and copyable as plain text.

The simulators retain their self-contained scripts and teaching assumptions. `lab-shell.css` and `lab-navigation.js` add portfolio navigation and shared light/dark preference. The lab index and board example reuse `../css/style.css` and `../css/teaching.css`. No login, tracking, service worker, external simulation library, or build dependency is required.

The classroom models are illustrative, not compliance or design-sizing tools. Keep assumptions and units with the activities. The massing activity's 5 m daylight and 12 m ventilation depths are teaching assumptions rather than pass/fail design criteria.

Manual checks: open each activity from the hub, change its primary control, reveal answers, preview printing, toggle the theme, and return to the hub. Test narrow mobile layouts as well as desktop. The shading exercise's first step is 27.7408°C; the thermal-mass hand exercise gives 20.122°C and 20.732°C. The massing activity uses the smaller plan dimension for its illustrative ventilation check.

Deployment continues through the existing GitHub Pages workflow on `master`; no hosting configuration changes are needed.
