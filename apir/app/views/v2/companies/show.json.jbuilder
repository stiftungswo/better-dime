# frozen_string_literal: true

json.extract! @company, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :archived, :name, :accountant_id, :rate_group_id, :salutation, :created_at, :updated_at, :deleted_at

# don't extract @company.company, this only leads to bugs due to duplicate data.

json.set! :addresses do
  json.array! @company.addresses do |address|
    json.extract! address, :id, :city, :country, :customer_id, :description, :zip, :street, :supplement, :deleted_at, :created_at, :updated_at, :hidden
  end
end

json.set! :phone_numbers do
  json.array! @company.phones do |phone|
    json.extract! phone, :id, :category, :customer_id, :number, :deleted_at, :created_at, :updated_at
  end
end

json.set! :people do
  json.array! @company.people do |person|
    json.extract! person, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :archived, :name, :accountant_id, :rate_group_id, :salutation, :created_at, :updated_at, :deleted_at
  end
end

json.set! :persons do
  json.array! @company.people.map(&:id)
end

json.set! :tags do
  json.array! @company.customer_tags.map(&:id)
end
