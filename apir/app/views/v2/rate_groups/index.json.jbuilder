# frozen_string_literal: true

json.array! @rate_groups do |rate_group|
  json.extract! rate_group.decorate, :id, :name, :description
end
