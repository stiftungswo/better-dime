# frozen_string_literal: true

json.extract! @customer, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :name, :accountant_id, :rate_group_id, :salutation, :newsletter, :biodiversity_course, :created_at, :updated_at, :deleted_at, :created_by, :updated_by, :deleted_by

json.company do
  if @customer.company
    json.extract! @customer, :id, :type, :comment, :company_id, :department, :email, :department_in_address, :first_name, :last_name, :hidden, :name, :accountant_id, :rate_group_id, :salutation, :newsletter, :biodiversity_course, :created_at, :updated_at, :deleted_at, :created_by, :updated_by, :deleted_by
  end
end

json.set! :addresses do
  json.array! @customer.all_addresses do |address|
    json.extract! address, :id, :city, :country, :customer_id, :description, :zip, :street, :supplement, :deleted_at, :created_at, :updated_at, :created_by, :updated_by, :deleted_by, :hidden
  end
end

json.set! :phone_numbers do
  json.array! @customer.phones do |phone|
    json.extract! phone, :id, :category, :customer_id, :number, :deleted_at, :created_at, :updated_at, :created_by, :updated_by, :deleted_by
  end
end

json.set! :tags, @customer.customer_tags.map(&:id)
