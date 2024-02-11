import { uiTooltip } from '../tooltip';
import { uiSection } from '../section';


export function uiSectionStravaActivityOptions(context) {
  const storage = context.systems.storage;
  const l10n = context.systems.l10n;

  const section = uiSection(context, 'strava-activities')
    .label(l10n.t('preferences.strava_activities.title'))
    .disclosureContent(renderDisclosureContent);

  const STRAVA_ACTIVITY_OPTIONS = ['all', 'ride', 'run', 'water', 'winter'];


  function renderDisclosureContent(selection) {
    let container = selection.selectAll('.strava-activity-options')
      .data([0]);

    // Enter
    const enter = container.enter()
      .append('div')
      .attr('class', 'strava-activity-options');

    enter
      .append('div')
      .attr('class', 'strava-activity-title')
      .text(l10n.t('preferences.strava.activities.title'));

    enter
      .append('ul')
      .attr('class', 'layer-list strava-activity-options-list');

    // Update
    container
      .merge(enter)
      .selectAll('.strava-activity-options-list')
      .call(drawListItems);
  }


  function drawListItems(selection) {
    let items = selection.selectAll('li')
      .data(STRAVA_ACTIVITY_OPTIONS);

    // Exit
    items.exit()
      .remove();

    // Enter
    let enter = items.enter()
      .append('li')
      .call(uiTooltip(context)
        .title(d => l10n.t(`preferences.strava.activities.${d}.tooltip`))
        .placement('top')
      );

    let label = enter
      .append('label');

    label
      .append('input')
      .attr('type', 'radio')
      .attr('name', 'strava_activity')
      .on('change', setActivityOption);

    label
      .append('span')
      .text(d => l10n.t(`preferences.strava.activities.${d}.title`));

    // Update
    items.merge(enter)
      .classed('active', isActiveActivityOption)
      .selectAll('input')
      .property('checked', isActiveActivityOption)
      .property('indeterminate', false);
  }


  function isActiveActivityOption(d) {
    const curr = storage.getItem('prefs.strava.activity') || 'all';
    return curr === d;
  }

  function setActivityOption(d3_event, d) {
    storage.setItem('prefs.strava.activity', d);
    section.reRender();
  }

  return section;
}