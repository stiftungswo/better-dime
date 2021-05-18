# frozen_string_literal: true

json.array! @customers do |customer|
  json.extract! customer.decorate, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :name
  json.extract! customer.decorate, :accountant_id, :rate_group_id, :salutation, :created_at, :updated_at, :deleted_at
  json.set! :duplicate, customer.is_duplicated?
  json.set! :invalid, customer.errors.any?
  json.set! :error_message, customer.errors.full_messages.join(",")
  json.set! :main_number, customer.phones.find(&:main?)&.number
  json.set! :mobile_number, customer.phones.find(&:mobile?)&.number
  json.set! :fax, customer.phones.find(&:fax?)&.number
  json.set! :rate_group_name, customer.rate_group&.name
  json.set! :customer_tag_name, customer.customer_tags&.first&.name
  json.extract! customer.addresses.first, :street, :supplement, :city, :supplement, :zip, :country, :description
end
