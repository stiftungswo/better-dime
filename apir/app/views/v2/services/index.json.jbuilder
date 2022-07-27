# frozen_string_literal: true

json.partial! "pagination", pagination: @services
json.set! :data do
  json.array! @services do |service|
    json.extract! service.decorate, :id, :name, :description, :vat, :local_order, :order, :archived, :service_category_id
    json.service_category do
      if service.service_category.present?
        json.partial! "v2/service_categories/service_category", category: service.service_category.decorate
      else
        json.null!
      end
    end
  end
end
