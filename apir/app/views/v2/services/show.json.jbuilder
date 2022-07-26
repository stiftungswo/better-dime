# frozen_string_literal: true

json.extract! @service.decorate, :id, :name, :description, :vat, :local_order, :order, :archived, :service_category_id
json.service_category do
  if @service.service_category.present?
    json.partial! "v2/service_categories/service_category", category: @service.service_category.decorate
  else
    json.null!
  end
end
json.set! :service_rates do
  json.array! @service.service_rates do |service_rate|
    json.extract! service_rate, :id, :rate_group_id, :service_id, :rate_unit_id, :value
  end
end
