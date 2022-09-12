# frozen_string_literal: true

class RevenueReportService
  attr_accessor :daterange, :offers, :projects, :invoices, :employees, :effort_minutes, :effort_minutes_by_cost_group, :cost_groups

  # TODO
  # - I have no idea by which definitions offers or projects are included here
  # - Many values might be wrong, verify hard!
  # - I am not proud of any of this code
  # - write a offer breakdown decorator
  # - write a invoice breakdown decorator
  def initialize(daterange = Date.today.all_year)
    self.daterange = daterange
    self.offers = Offer.where(created_at: daterange)
                       .where.not(id: Project.where.not(offer_id: nil).select(:offer_id))
                       .includes(:accountant, :customer, :offer_positions, :offer_discounts)
                       .order(name: :asc)
    self.projects = Project.joins(:project_efforts)
                           .where(created_at: daterange)
                           .where("project_efforts.date" => daterange)
                           .distinct
                           .includes(
                             :accountant, :customer, :project_costgroup_distributions,
                             project_positions: [:project_efforts, :position_group, :rate_unit],
                             offer: [:accountant, :customer, :offer_positions, :offer_discounts],
                             invoices: [:invoice_costgroup_distributions, :invoice_discounts, { invoice_positions: [:position_group] }]
                           ).order(name: :asc)
    self.invoices = Invoice.where(created_at: daterange)
                           .where(project_id: nil)
                           .includes(
                             :accountant, :customer,
                             :invoice_costgroup_distributions, :invoice_discounts, invoice_positions: [:position_group]
                           ).order(name: :asc)
    self.cost_groups = Costgroup.all.order(number: :asc)
  end

  def rows
    all_rows = offers.map do |offer|
      offer_price = (offer.breakdown[:fixed_price] || offer.breakdown[:total]) # TODO: Decorator
      row = ["Offerte", pretty_status[offer.status], offer.name, nil, offer.customer&.full_name, offer.created_at.strftime("%d.%m.%Y"), offer.accountant&.name, nil, nil, offer_price]
      row += cost_groups.map { nil }
      row += [nil]
    end
    all_rows += projects.map do |project|
      offer_price = project.offer ? (project.offer.breakdown[:fixed_price] || project.offer.breakdown[:total]) : nil # TODO: Decorator

      no_costgroup_prices = 0

      if project.invoices.blank?
        invoice_price = nil
        invoice_price_by_costgroup = cost_groups.map { nil }
      else
        invoice_price = project.invoices.reject { |invoice| invoice.invoice_positions.blank? }.sum { |invoice| (invoice.breakdown[:fixed_price] || invoice.breakdown[:total]) } # TODO: Decorator
        invoice_price = nil if invoice_price.zero?
        invoice_price_by_costgroup = {}
        project.invoices.each do |invoice|
          total_id_weight = invoice.invoice_costgroup_distributions.inject(0) { |sum, d| sum + d.weight }
          invoice.invoice_costgroup_distributions.each do |distribution|
            invoice_price_by_costgroup[distribution.costgroup_number] ||= 0
            invoice_price_by_costgroup[distribution.costgroup_number] += ((invoice.breakdown[:fixed_price] || invoice.breakdown[:total]) * distribution.weight / total_id_weight)
          end

          no_costgroup_prices += (invoice.breakdown[:fixed_price] || invoice.breakdown[:total]) if invoice.invoice_costgroup_distributions.blank?
        end
      end

      category_names = project.project_categories.map(&:name)

      row = ["Projekt", nil, project.name, category_names.join(", "), project.customer&.full_name, project.created_at.strftime("%d.%m.%Y"), project.accountant&.name, project.current_price, invoice_price, offer_price]
      row += cost_groups.map { |cost_group| invoice_price_by_costgroup[cost_group.number] }
      row += [no_costgroup_prices]
      row
    end
    all_rows += invoices.map do |invoice|
      invoice_price = (invoice.breakdown[:fixed_price] || invoice.breakdown[:total]) # TODO: Decorator
      row = ["Rechnung", nil, invoice.name, nil, invoice.customer&.full_name, invoice.created_at.strftime("%d.%m.%Y"), invoice.accountant&.name, nil, invoice_price, nil]
      invoice_price_by_costgroup = {}
      total_id_weight = invoice.invoice_costgroup_distributions.inject(0) { |sum, d| sum + d.weight }
      invoice.invoice_costgroup_distributions.each do |distribution|
        invoice_price_by_costgroup[distribution.costgroup_number] ||= 0
        invoice_price_by_costgroup[distribution.costgroup_number] += ((invoice.breakdown[:fixed_price] || invoice.breakdown[:total]) * (distribution.weight / total_id_weight))
      end
      row += cost_groups.map { |cost_group| (invoice_price_by_costgroup[cost_group.number] || 0) }
      row += [nil]
      row
    end

    all_rows
      .map { |row| row.map { |column| column.is_a?(Numeric) ? (column / 100).round : column } }
      .map { |row| row.map { |column| column.is_a?(Numeric) && column.zero? ? nil : column } }
  end

  HEADER = ["Typ", "Status", "Name", "Kategorie (Tätigkeitsbereich)", "Auftraggeber", "Start", "Verantwortlicher Mitarbeiter", "Aufwand CHF (Projekt)", "Umsatz CHF (Rechnung)", "Umsatz erwartet CHF (Offerte)"].freeze
  def header
    HEADER + cost_groups.map { |cost_group| "#{cost_group.number}, #{cost_group.name}" } + ["Keine Kostenstelle"]
  end

  def footer
    HEADER.map { "" } + cost_groups.map { nil }
  end

  def table
    t = []
    t << header
    t += rows
    t << footer
    t
  end

  def pretty_status
    { nil => "", 1 => "Offeriert", 2 => "Bestätigt", 3 => "Abgelehnt" }
  end

  # some love for console developers
  def tty
    Rails.logger.debug TTY::Table.new rows: table
  end
end
