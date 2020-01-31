json.set! :data do
  json.array! @projects_wp_invoices do |project|
    json.extract! project.decorate, :id, :name
    json.last_effort_date project.decorate.last_effort_date unless project.last_effort_date.nil?
    json.last_invoice_date project.decorate.last_invoice_date unless project.last_invoice_date.nil?

    unless ProjectCalculator.days_since_last_invoice(project).nil?
      json.days_since_last_invoice ProjectCalculator.days_since_last_invoice(project)
    end
  end
end
