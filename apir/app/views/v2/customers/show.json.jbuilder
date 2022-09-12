# frozen_string_literal: true

json.extract! @customer, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :archived, :name, :accountant_id, :rate_group_id, :salutation, :created_at, :updated_at, :deleted_at

json.company do
  if @customer.company
    json.extract! @customer, :id, :type, :comment, :company_id, :department, :email, :department_in_address, :first_name, :last_name, :hidden, :archived, :name, :accountant_id, :rate_group_id, :salutation, :created_at, :updated_at,
                  :deleted_at
  end
end

json.set! :addresses do
  json.array! @customer.all_addresses do |address|
    json.extract! address, :id, :city, :country, :customer_id, :description, :zip, :street, :supplement, :deleted_at, :created_at, :updated_at, :hidden
  end
end

json.set! :phone_numbers do
  json.array! @customer.phones do |phone|
    json.extract! phone, :id, :category, :customer_id, :number, :deleted_at, :created_at, :updated_at
  end
end

json.set! :tags, @customer.customer_tags.map(&:id)
