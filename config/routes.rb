# frozen_string_literal: true

Statewidget::Engine.routes.draw do
  get "/examples" => "examples#index"
  # define routes here
end

Discourse::Application.routes.draw { mount ::Statewidget::Engine, at: "statewidget" }
