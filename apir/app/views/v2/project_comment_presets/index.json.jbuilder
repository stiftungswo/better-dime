# frozen_string_literal: true

json.partial! "pagination", pagination: @presets
json.set! :data do
  json.array! @presets do |preset|
    json.extract! preset.decorate, :id, :comment_preset
  end
end
