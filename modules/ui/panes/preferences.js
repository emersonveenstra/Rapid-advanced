import { uiPane } from '../pane.js';
import { uiSectionPrivacy } from '../sections/privacy.js';
//import { uiSectionColorSelection } from '../sections/color_selection.js';
//import { uiSectionColorblindModeOptions } from '../sections/colorblind_mode_options.js';
import { uiSectionMapInteractionOptions } from '../sections/map_interaction_options.js';
import { uiSectionStravaActivityOptions } from '../sections/strava_activity_options';
import { uiSectionStravaColorOptions } from '../sections/strava_color_options';


export function uiPanePreferences(context) {
  const l10n = context.systems.l10n;

  return uiPane(context, 'preferences')
    .key(l10n.t('preferences.key'))
    .label(l10n.t('preferences.title'))
    .description(l10n.t('preferences.description'))
    .iconName('fas-user-cog')
    .sections([
      uiSectionPrivacy(context),
      uiSectionMapInteractionOptions(context),
      uiSectionStravaActivityOptions(context),
      uiSectionStravaColorOptions(context)
//      uiSectionColorSelection(context),
//      uiSectionColorblindModeOptions(context)
    ]);
}
