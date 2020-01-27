json.extract! @employee, :id, :email, :is_admin, :created_at, :updated_at, :first_name, :last_name, :can_login, :archived, :holidays_per_year, :deleted_at, :employee_group_id, :first_vacation_takeover
json.set! :group_name, @employee.employee_group&.name
json.group do
  json.extract! @employee.employee_group.decorate, :id, :name, :created_at, :updated_at, :deleted_at, :created_by, :updated_by, :deleted_by
end
json.set! :work_periods do
  json.array! @employee.work_periods.decorate do |work_period|
    json.extract! work_period, :id, :employee_id, :ending, :pensum, :beginning, :yearly_vacation_budget, :deleted_at, :created_at, :updated_at, :created_by, :updated_by, :deleted_by
  end
end