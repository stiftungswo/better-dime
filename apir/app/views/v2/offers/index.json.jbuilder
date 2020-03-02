# frozen_string_literal: true

json.partial! "pagination", pagination: @offers
json.set! :data do
  json.array! @offers do |offer|
    json.extract! offer.decorate, :id, :description, :short_description, :name
  end
end
