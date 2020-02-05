# frozen_string_literal: true
json.array! @costgroups do |costgroup|
  json.extract! costgroup.decorate, :number, :name
end
