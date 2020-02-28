# frozen_string_literal: true

class RevenueReportService
  attr_accessor :daterange
  attr_accessor :offers, :projects
  attr_accessor :employees, :projects, :project_efforts, :project_positions, :effort_minutes, :effort_minutes_by_cost_group, :cost_groups

  # TODO
  # - I have no idea by which definitions offers or projects are included here
  # - Many values might be wrong, verify hard!
  # - I am not proud of any of this code
  # - write a offer breakdown decorator
  # - write a invoice breakdown decorator
  def initialize(daterange = (Date.today.beginning_of_year..Date.today.end_of_year))
    self.daterange = daterange
    self.offers = Offer.where(created_at: daterange).where.not(id: Project.where.not(offer_id: nil).select(:offer_id)).includes(:accountant, :customer, :offer_positions, :offer_discounts).order(created_at: :asc)
    self.project_positions = ProjectPosition.joins(:project, :project_efforts).where("project_efforts.date" => daterange)
    self.projects = Project.joins(:project_efforts).where("project_efforts.date" => daterange, chargeable: true).distinct
                           .includes(:accountant, :customer, :project_category, :offer,
                                     invoices: [:invoice_costgroup_distributions, :invoice_positions, :invoice_discounts],
                                     offer: [:offer_positions, :offer_discounts]).order(name: :asc)
    self.cost_groups = Costgroup.all.order(number: :asc)
  end

  def rows
    all_rows = offers.map do |offer|
      offer_price = (offer.breakdown[:fixed_price] || offer.breakdown[:total]).round # TODO: Decorator
      row = ["Offerte", offer.name, nil, offer.customer&.name, offer.created_at.strftime("%d.%m.%Y"), offer.accountant&.name, nil, nil, offer_price]
      row += cost_groups.map { nil }
    end
    all_rows += projects.map do |project|
      offer_price = project.offer ? (project.offer.breakdown[:fixed_price] || project.offer.breakdown[:total]) : nil # TODO: Decorator

      invoice_price = project.invoices.sum { |invoice| (invoice.breakdown[:fixed_price] || invoice.breakdown[:total]) } # TODO: Decorator
      invoice_price = nil if invoice_price.zero?
      invoice_price_by_costgroup = {}
      project.invoices.each do |invoice|
        invoice.invoice_costgroup_distributions.each do |distribution|
          invoice_price_by_costgroup[distribution.costgroup_number] ||= 0
          invoice_price_by_costgroup[distribution.costgroup_number] += ((invoice.breakdown[:fixed_price] || invoice.breakdown[:total]) * (distribution.weight / 100)).round
        end
      end
      current_price = nil # (project.current_price  / 100).round # TODO maybe the right value? # TODO THIS IS SLOW AS FUCK N+X

      row = ["Projekt", project.name, project.project_category&.name, project.customer&.name, project.created_at.strftime("%d.%m.%Y"), project.accountant&.name, current_price, invoice_price, offer_price]
      row += cost_groups.map { |cost_group| invoice_price_by_costgroup[cost_group.number] }
      row
    end
    all_rows.map { |column| column.is_a?(Numeric) ? (column / 100).round : column }
  end

  HEADER = ["Typ", "Name", "Kategorie (Tätigkeitsbereich)", "Auftraggeber", "Start", "Verantwortlicher Mitarbeiter", "Aufwand CHF (Projekt)", "Umsatz CHF (Rechnung)", "Umsatz erwartet CHF (Offerte)"].freeze
  def header
    HEADER + cost_groups.map { |cost_group| "#{cost_group.number}, #{cost_group.name}" }
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

  # some love for console developers
  def tty
    puts TTY::Table.new rows: table
  end
end
