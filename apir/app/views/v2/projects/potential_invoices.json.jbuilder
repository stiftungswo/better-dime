# frozen_string_literal: true

json.set! :data do
  json.array! @projects_wp_invoices do |project|
    json.extract! project.decorate, :id, :name
    json.last_effort_date project.decorate.last_effort_date if project.last_effort_date
    json.last_invoice_date project.decorate.last_invoice_date if project.last_invoice_date

    json.days_since_last_invoice ProjectCalculator.days_since_last_invoice(project) if ProjectCalculator.days_since_last_invoice(project)
  end
end
