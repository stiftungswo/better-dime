# frozen_string_literal: true

json.partial! "pagination", pagination: @services
json.set! :data do
  json.array! @services do |service|
    json.extract! service.decorate, :id, :name, :description, :vat, :local_order, :order, :archived, :service_category_id
  end
end
