import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { ajax } from "discourse/lib/ajax";
import I18n from "I18n";

const STAT_ALIASES = {
  topic_count_7_days: "topics",
  topics_7_days: "topics",
  post_count_7_days: "posts",
  posts_7_days: "posts",
  active_user_count_7_days: "active_users",
  active_users_7_days: "active_users",
  new_user_count_7_days: "new_users",
  new_users_7_days: "new_users",
  like_count_7_days: "likes",
  likes_7_days: "likes",
};

const STAT_ORDER = ["topics", "posts", "active_users", "new_users", "likes"];

export default class StatewidgetActivity extends Component {
  @service siteSettings;

  @tracked loading = true;
  @tracked loadFailed = false;
  @tracked stats = [];

  constructor() {
    super(...arguments);
    this.loadActivity();
  }

  get enabled() {
    return this.siteSettings.statewidget_enabled;
  }

  get hasData() {
    return this.stats.length > 0;
  }

  async loadActivity() {
    if (!this.enabled) {
      this.loading = false;
      return;
    }

    try {
      const response = await ajax("/about.json");
      const secondaryStats = response?.about?.details?.secondary_stats;

      this.stats = this.extractStats(secondaryStats);
    } catch (error) {
      // Keep the UI simple while still surfacing issues to the user.
      this.loadFailed = true;
    } finally {
      this.loading = false;
    }
  }

  extractStats(rawStats) {
    if (!Array.isArray(rawStats)) {
      return [];
    }

    const collected = {};

    rawStats.forEach((stat) => {
      const identifier = stat?.id || stat?.name || stat?.key || stat?.type;
      const mappedKey = STAT_ALIASES[identifier];
      const value = stat?.value ?? stat?.count;

      if (mappedKey && value !== undefined && value !== null) {
        collected[mappedKey] = value;
      }
    });

    return STAT_ORDER.filter((key) => collected[key] !== undefined).map(
      (key) => ({
        key,
        label: I18n.t(`statewidget.activity.${key}`),
        value: collected[key],
      })
    );
  }
}
