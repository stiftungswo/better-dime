# frozen_string_literal: true

json.extract! @company, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :name, :accountant_id, :rate_group_id, :salutation, :newsletter, :biodiversity_course, :created_at, :updated_at, :deleted_at, :created_by, :updated_by, :deleted_by

json.company do
  if @company.company
    json.extract! @company, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :name, :accountant_id, :rate_group_id, :salutation, :newsletter, :biodiversity_course, :created_at, :updated_at, :deleted_at, :created_by, :updated_by, :deleted_by
  end
end

json.set! :addresses do
  json.array! @company.addresses do |address|
    json.extract! address, :id, :city, :country, :customer_id, :description, :zip, :street, :supplement, :deleted_at, :created_at, :updated_at, :created_by, :updated_by, :deleted_by, :hidden
  end
end

json.set! :phone_numbers do
  json.array! @company.phones do |phone|
    json.extract! phone, :id, :category, :customer_id, :number, :deleted_at, :created_at, :updated_at, :created_by, :updated_by, :deleted_by
  end
end

json.set! :people do
  json.array! @company.people do |person|
    json.extract! person, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :name, :accountant_id, :rate_group_id, :salutation, :newsletter, :biodiversity_course, :created_at, :updated_at, :deleted_at, :created_by, :updated_by, :deleted_by
  end
end

json.set! :persons do
  json.array! @company.people.map(&:id)
end

json.set! :tags do
  json.array! @company.customer_tags.map(&:id)
end
