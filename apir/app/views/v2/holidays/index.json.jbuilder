# frozen_string_literal: true

json.partial! "pagination", pagination: @holidays
json.set! :data do
  json.array! @holidays do |holiday|
    json.extract! holiday.decorate, :id, :name, :date, :duration
  end
end
