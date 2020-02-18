json.array! @customers do |customer|
  json.extract! customer.decorate, :id, :type, :comment, :company_id, :department, :email, :first_name, :last_name, :hidden, :name
  json.extract! customer.decorate, :rate_group_id, :salutation, :created_at, :updated_at, :deleted_at, :created_by, :updated_by, :deleted_by
  json.set! :duplicate, customer.is_duplicated?
  json.set! :invalid, customer.errors.any?
  json.set! :error_message, customer.errors.full_messages.join(",")
  json.set! :main_number, customer.phones.find(&:mobile?)&.number
  json.set! :mobile_number, customer.phones.find(&:mobile?)&.number
  json.set! :fax, customer.phones.find(&:mobile?)&.number
  json.set! :rate_group_name, customer.rate_group&.name
  json.extract! customer.addresses.first, :street, :supplement, :city, :supplement, :zip, :country, :description
end
