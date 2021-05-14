# frozen_string_literal: true

json.extract! @employee, :id, :email, :is_admin, :created_at, :updated_at, :first_name,
              :last_name, :can_login, :archived, :holidays_per_year, :deleted_at, :employee_group_id, :locale
json.set! :first_vacation_takeover, @employee.first_vacation_takeover&.to_i
json.set! :group_name, @employee.employee_group&.name
json.group do
  json.extract! @employee.employee_group.decorate, :id, :name, :created_at, :updated_at, :deleted_at
end
json.set! :work_periods do
  json.array! @work_periods
end

json.set! :addresses do
  json.array! @employee.addresses do |address|
    json.extract! address, :id, :city, :country, :customer_id, :description, :zip, :street, :supplement, :deleted_at, :created_at, :updated_at, :hidden
  end
end
