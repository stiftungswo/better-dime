# frozen_string_literal: true

json.partial! "pagination", pagination: @customers
json.set! :data do
  json.array! @customers do |customer|
    json.extract! customer.decorate, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :archived, :name, :accountant_id, :rate_group_id, :salutation, :created_at, :updated_at, :deleted_at
    json.company do
      if customer.company
        json.extract! customer.company&.decorate, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :archived, :name, :accountant_id, :rate_group_id, :salutation, :created_at, :updated_at, :deleted_at
      end
    end
  end
end
