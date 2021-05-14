# frozen_string_literal: true

employees_group = EmployeeGroup.create! name: "SWO Angestellte"
zivi_group = EmployeeGroup.create! name: "Zivi"
uwt_group = EmployeeGroup.create! name: "UWT Teilnehmer"

Employee.create!(
  [
    { email: "zivi@example.com", first_name: "Zivi", last_name: "Muster", password: "123456", holidays_per_year: 20, employee_group: zivi_group, is_admin: true },
    { email: "employee@example.com", first_name: "Mitarbeiter", last_name: "Muster", password: "123456", holidays_per_year: 20, employee_group: employees_group },
    { email: "uwt@example.com", first_name: "UWT", last_name: "Muster", password: "123456", holidays_per_year: 20, employee_group: uwt_group }
  ]
)
