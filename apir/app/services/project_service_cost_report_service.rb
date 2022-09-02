# frozen_string_literal: true

# :nocov:
class ProjectServiceCostReportService
  attr_accessor :range, :with_vat, :projects, :project_efforts, :project_positions, :services, :effort_costs, :effort_costs_by_service

  def initialize(range = Date.today.all_year, selected_services, with_vat)
    raise StandardError, "Non-integer service IDs." unless selected_services.all? { |i| i =~ /^[0-9]+$/ }

    self.range = range
    self.with_vat = with_vat
    # turn [] into nil
    service_filter = selected_services.presence
    self.project_positions = ProjectPosition.joins(:project_efforts, :rate_unit, :service)
                                            # if service_filter is nil, we don't want it as an argument -> use compact
                                            .where({ "project_efforts.date" => range, "service_id" => service_filter }.compact)
    self.projects = Project.where(id: project_positions.select("projects.id"))
    self.services = Service.where(id: service_filter || project_positions.select("services.id")).order(name: :asc)
    charge = "price_per_rate * project_efforts.value / rate_units.factor"
    charge += " * (1 + project_positions.vat)" if self.with_vat
    self.effort_costs = project_positions.group("project_id", "services.id").sum(charge)
    self.effort_costs_by_service = project_positions.group("services.id").sum(charge)
  end

  def to_francs(centimes)
    (centimes / 100).round(2)
  end

  def effort
    @effort = {}
    effort_costs.each do |(project_id, service_id), cost|
      @effort[project_id] ||= {}
      @effort[project_id][service_id] = cost
    end
    @effort.transform_keys! do |project_id|
      projects.find { |project| project.id == project_id } || Project.new(name: "Projekte ohne Tätigkeitsbereich")
    end
    @effort.transform_values! do |service_efforts|
      service_efforts.transform_keys! do |service_id|
        services.find { |service| service.id == service_id } || Service.new
      end
      service_efforts
    end
    @effort
  end

  def rows
    effort.map do |project, service_effort|
      names = project.project_categories.map(&:name)
      row = [project.id || 0, project.name, project.project_categories&.ids&.join(", "), names.join(", ")]
      row_costs = services.map { |service| service_effort[service] || 0.0 }
      row += row_costs.map { |cost| to_francs(cost) }
      row += [to_francs(row_costs.sum)] # total
      row
    end
  end

  def header
    ["Projekt ID", "Projekt", "Tätigkeitsbereich IDs", "Tätigkeitsbereiche"] + services.map(&:name) + ["Total"]
  end

  def footers
    total_costs = services.map do |service|
      (effort_costs_by_service[service.id] || 0.0)
    end
    [
      ["", "", "", "Total"] + total_costs.map { |cost| to_francs(cost) } + [to_francs(total_costs.sum)],
      ["", "", "", "(Alles in CHF, #{with_vat ? "mit" : "ohne"} MWSt.)"]
    ]
  end

  def table
    t = []
    t << header
    t += rows
    t += footers
    t
  end

  # some love for console developers
  def tty
    Rails.logger.debug TTY::Table.new rows: rows
  end
end
# :nocov:
