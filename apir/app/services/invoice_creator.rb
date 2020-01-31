class InvoiceCreator
  def self.create_invoice_from_project(project)
    invoice = Invoice.new
    invoice.accountant = project.accountant
    invoice.project = project
    invoice.address = project.address
    invoice.customer = project.customer
    invoice.description = project.description
    invoice.name = project.name
    invoice.fixed_price = project.fixed_price

    invoice.invoice_costgroup_distributions = create_costgroups_from_project(invoice, project)
    invoice.invoice_discounts = create_discounts_from_project(invoice, project)
    invoice.invoice_positions = create_positions_from_project(invoice, project)
    invoice.beginning = get_invoice_beginning_date(project)
    invoice.ending = get_invoice_ending_date(project)
    invoice
  end

  private

  def self.create_costgroups_from_project(invoice, project)
    project.project_costgroup_distributions.map do |costgroup|
      invoice_costgroup = InvoiceCostgroupDistribution.new
      invoice_costgroup.invoice = invoice
      invoice_costgroup.costgroup = costgroup.costgroup
      invoice_costgroup.weight = costgroup.weight
      invoice_costgroup
    end || []
  end

  def self.create_discounts_from_project(invoice, project)
    unless project.offer.nil? or project.offer.offer_discounts.nil?
      project.offer.offer_discounts.map do |discount|
        invoice_discount = InvoiceDiscount.new
        invoice_discount.invoice = invoice
        invoice_discount.name = discount.name
        invoice_discount.value = discount.value
        invoice_discount.percentage = discount.percentage
        invoice_discount
      end
    end || []
  end

  def self.create_positions_from_project(invoice, project)
    project.project_positions.map do |position|
      invoice_position = InvoicePosition.new
      invoice_position.invoice = invoice
      invoice_position.project_position = position
      invoice_position.rate_unit = position.rate_unit
      invoice_position.position_group = position.position_group
      invoice_position.amount = position.efforts_value
      invoice_position.description = position.description.blank? ? position.service.name : position.description
      invoice_position.vat = position.vat
      invoice_position.price_per_rate = position.price_per_rate
      invoice_position.order = position.order
      invoice_position
    end || []
  end

  def self.get_invoice_beginning_date(project)
    project.invoices.max_by {|invoice| invoice.ending}&.ending || project.project_efforts.min_by {|effort| effort.date}&.date || DateTime.now
  end

  def self.get_invoice_ending_date(project)
    project.project_efforts.max_by {|effort| effort.date}&.date || DateTime.now
  end
end
