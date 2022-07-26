# frozen_string_literal: true

json.array! @service_categories do |service_category|
  json.partial! "v2/service_categories/service_category", category: service_category.decorate
  json.extract! service_category.decorate, :created_at, :updated_at
  json.parent do
    if service_category.parent_category.present?
      json.partial! "v2/service_categories/service_category", category: service_category.parent_category.decorate
	else
	  json.null!
	end
  end
end
