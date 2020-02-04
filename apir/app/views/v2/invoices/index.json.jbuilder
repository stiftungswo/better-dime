# frozen_string_literal: true

# json.partial! 'pagination', pagination: $offers
json.partial! "pagination", pagination: @invoices
json.set! :data do
  json.array! @invoices do |invoice|
    json.extract! invoice.decorate, :id, :description, :name, :beginning, :ending
  end
end
