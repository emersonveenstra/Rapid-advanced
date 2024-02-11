import { uiSection } from '../section';


export function uiSectionStravaColorOptions(context) {
  const storage = context.systems.storage;
  const l10n = context.systems.l10n;
  const imagery = context.systems.imagery;
  const map = context.systems.map;
  let stravaSource = imagery.sources(map.extent(), map.zoom()).filter(isStrava)[0];

  const section = uiSection(context, 'strava-colors')
    .label(l10n.t('preferences.strava.colors.title'))
    .disclosureContent(renderDisclosureContent);

  const STRAVA_COLOR_OPTIONS = ['hot', 'blue', 'gray', 'purple', 'bluered', 'orange'];


  function renderDisclosureContent(selection) {
    let container = selection.selectAll('.strava-color-options')
      .data([0]);

    // Enter
    const enter = container.enter()
      .append('div')
      .attr('class', 'strava-color-options');

    enter
      .append('div');

    enter
      .append('ul')
      .attr('class', 'layer-list strava-color-options-list');

    // Update
    container
      .merge(enter)
      .selectAll('.strava-color-options-list')
      .call(drawListItems);
  }


  function drawListItems(selection) {
    let items = selection.selectAll('li')
      .data(STRAVA_COLOR_OPTIONS);

    // Exit
    items.exit()
      .remove();

    // Enter
    let enter = items.enter()
      .append('li');

    let label = enter
      .append('label');

    label
      .append('input')
      .attr('type', 'radio')
      .attr('name', 'strava_color')
      .on('change', setColorOption);

    label
      .append('span')
      .text(d => l10n.t(`preferences.strava.colors.${d}.title`));

    // Update
    items.merge(enter)
      .classed('active', isActiveColorOption)
      .selectAll('input')
      .property('checked', isActiveColorOption)
      .property('indeterminate', false);
  }


  function isActiveColorOption(d) {
    const curr = storage.getItem('prefs.strava.color') || 'hot';
    return curr === d;
  }

  function setColorOption(d3_event, d) {
    storage.setItem('prefs.strava.color', d);
    toggleStrava();
    section.reRender();
    window.setTimeout(toggleStrava, 400);
  }

  function isStrava(d) {
    return d.id === 'strava-heatmap';
  }

  function toggleStrava() {
    imagery.toggleOverlayLayer(stravaSource);
  }

  return section;
}