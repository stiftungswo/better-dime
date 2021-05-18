# frozen_string_literal: true

json.partial! "pagination", pagination: @employees
json.set! :data do
  json.array! @employees do |employee|
    json.extract! employee.decorate, :id, :email, :is_admin, :created_at, :updated_at,
                  :first_name, :last_name, :can_login, :archived, :holidays_per_year,
                  :deleted_at, :employee_group_id, :first_vacation_takeover, :locale
    json.set! :group_name, employee.decorate.employee_group&.name
    json.group do
      json.extract! employee.employee_group.decorate, :id, :name, :created_at, :updated_at, :deleted_at
    end
  end
end
