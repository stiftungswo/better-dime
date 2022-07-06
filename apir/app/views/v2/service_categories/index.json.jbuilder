# frozen_string_literal: true

json.array! @service_categories do |service_category|
  json.extract! service_category.decorate, :id, :name, :number, :order, :created_at, :updated_at, :parent_category_id
  json.parent do
    if service_category.parent_category.present?
	  json.extract! service_category.parent_category.decorate, :id, :name, :number
	else
	  json.null!
	end
  end
end
