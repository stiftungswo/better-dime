# frozen_string_literal: true

class InvoiceCreator
  def self.create_invoice_from_project(project)
    invoice = Invoice.new
    invoice.beginning = get_invoice_beginning_date(project)
    invoice.ending = get_invoice_ending_date(project, invoice.beginning)
    create_invoice(invoice, project)
  end

  def self.update_timespan(invoice, beginning, ending)
    invoice.beginning = beginning
    invoice.ending = ending
    create_invoice(invoice, invoice.project)
  end

  private

  def self.create_invoice(invoice, project)
    invoice.accountant = project.accountant
    invoice.project = project
    invoice.address = project.address
    invoice.customer = project.customer
    invoice.description = project.description
    invoice.name = project.name
    invoice.fixed_price = project.fixed_price
    invoice.location = project.location

    invoice.invoice_costgroup_distributions = create_costgroups_from_project(invoice, project)
    invoice.invoice_discounts = create_discounts_from_project(invoice, project)
    invoice.invoice_positions = create_positions_from_project(invoice, project)
    invoice
  end

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
    unless project.offer.nil? || project.offer.offer_discounts.nil?
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
    group_mapping = Hash[project.position_groupings.map do |old_group|
      new_group = old_group.dup
      [old_group, new_group]
    end]
    group_mapping[nil] = nil

    new_positions = project.project_positions.map do |position|
      invoice_position = InvoicePosition.new
      invoice_position.invoice = invoice
      invoice_position.project_position = position
      invoice_position.rate_unit = position.rate_unit
      invoice_position.position_group = group_mapping[position.position_group]
      amount = (position.project_efforts.inject(0) { |sum, e| sum + (e.date <= invoice.ending && e.date >= invoice.beginning ? e.value : 0) } / position.rate_unit.factor).round 2
      invoice_position.amount = amount
      invoice_position.description = position.description.presence || position.service.name
      invoice_position.vat = position.vat
      invoice_position.price_per_rate = position.price_per_rate
      invoice_position.order = position.order
      invoice_position
    end || []
    PositionGroupRemapper.remap_all_groups(project.position_groupings, new_positions)
    new_positions
  end

  def self.get_invoice_beginning_date(project)
    last_date = project.invoices.max_by(&:ending)&.ending
    last_date ? last_date + 1.day : (project.project_efforts.min_by(&:date)&.date || DateTime.now)
  end

  def self.get_invoice_ending_date(project, beginning)
    ending = project.project_efforts.max_by(&:date)&.date || DateTime.now
    if (ending < beginning) 
      ending = beginning
    end
    ending
  end
end
