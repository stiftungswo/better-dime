# frozen_string_literal: true

json.extract! @person, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :name, :rate_group_id, :salutation, :created_at, :updated_at, :deleted_at, :created_by, :updated_by, :deleted_by
json.company do
  if @person.company
    json.extract! @person, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :name, :rate_group_id, :salutation, :created_at, :updated_at, :deleted_at, :created_by, :updated_by, :deleted_by
  end
end

json.set! :addresses do
  json.array! @person.addresses do |address|
    json.extract! address, :id, :city, :country, :customer_id, :description, :zip, :street, :supplement, :hidden, :deleted_at, :created_at, :updated_at, :created_by, :updated_by, :deleted_by
  end
end

json.set! :phone_numbers do
  json.array! @person.phones do |phone|
    json.extract! phone, :id, :category, :customer_id, :number, :deleted_at, :created_at, :updated_at, :created_by, :updated_by, :deleted_by
  end
end

json.set! :tags do
  json.array! @person.customer_tags.map(&:id)
end
