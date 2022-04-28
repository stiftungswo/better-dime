# frozen_string_literal: true

json.array! @holidays do |holiday|
  json.extract! holiday.decorate, :id, :name, :date, :duration
end
