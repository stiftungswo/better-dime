# frozen_string_literal: true

json.array! @locations do |location|
  json.extract! location.decorate, :id, :name, :url, :archived
end
