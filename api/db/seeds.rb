# frozen_string_literal: true

zivi_group = EmployeeGroup.create! name: 'Zivi'
employees_group = EmployeeGroup.create! name: 'SWO Angestellte'
uwt_group = EmployeeGroup.create! name: 'UWT Teilnehmer'

Employee.create!(
  [
    { email: 'zivi@example.com', first_name: 'Zivi', last_name: 'Muster', password: '123456', holidays_per_year: 20, employee_group: zivi_group },
    { email: 'employee@example.com', first_name: 'Mitarbeiter', last_name: 'Muster', password: '123456', holidays_per_year: 20, employee_group: employees_group },
    { email: 'uwt@example.com', first_name: 'UWT', last_name: 'Muster', password: '123456', holidays_per_year: 20, employee_group: uwt_group }
  ]
)
