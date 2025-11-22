# frozen_string_literal: true

# name: statewidget
# about: TODO
# meta_topic_id: TODO
# version: 0.0.1
# authors: Discourse
# url: TODO
# required_version: 2.7.0

enabled_site_setting :statewidget_enabled

module ::Statewidget
  PLUGIN_NAME = "statewidget"
end

require_relative "lib/statewidget/engine"

after_initialize do
  # Code which should run after Rails has finished booting
end
