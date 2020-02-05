# frozen_string_literal: true

json.partial! "pagination", pagination: @rate_units
json.set! :data do
  json.array! @rate_units do |rate_unit|
    json.extract! rate_unit.decorate, :id, :listing_name, :billing_unit, :effort_unit, :is_time, :factor, :name, :archived
  end
end
