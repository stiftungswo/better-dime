# frozen_string_literal: true

json.set! :dates do
  json.array! @dates.map { |date| date.strftime("%F") }
end

json.set! :employees do
  json.array! @employee_efforts.sort_by { |e| e[:name] }
end
