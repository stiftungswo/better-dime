# frozen_string_literal: true

class ProjectCategoryServiceHourReportService
  attr_accessor :range, :project_categories, :project_efforts, :project_positions, :services, :effort_minutes, :effort_minutes_by_service

  def initialize(range = (Date.today.beginning_of_year..Date.today.end_of_year))
    self.range = range
    self.project_positions = ProjectPosition.joins(:project_efforts, :rate_unit, :service, :project)
                                            .where("rate_units.is_time" => true, "project_efforts.date" => range)
                                            .joins("LEFT OUTER JOIN project_category_distributions ON project_positions.project_id = project_category_distributions.project_id")
    self.project_categories = ProjectCategory.where(id: project_positions.select("category_id"))
    self.services = Service.where(id: project_positions.select("services.id")).order(name: :asc)
    self.effort_minutes = project_positions.group("category_id", "services.id").sum("project_efforts.value")
    self.effort_minutes_by_service = project_positions.group("services.id").sum("project_efforts.value")
  end

  def effort
    @effort = {}
    effort_minutes.each do |(project_category_id, service_id), minutes|
      @effort[project_category_id] ||= {}
      @effort[project_category_id][service_id] = minutes
    end
    @effort.transform_keys! do |project_category_id|
      project_categories.find { |project_category| project_category.id == project_category_id } || ProjectCategory.new(name: "Projekte ohne Tätigkeitsbereich")
    end
    @effort.transform_values! do |service_efforts|
      service_efforts.transform_keys! do |service_id|
        services.find { |service| service.id == service_id } || Service.new
      end
      service_efforts.transform_values! do |minutes|
        (minutes / 60.0).round(2)
      end
      service_efforts
    end
    @effort
  end

  def rows
    effort.map do |category, service_effort|
      row = [category.id || 0, category.name]
      row += services.map { |service| service_effort[service] || 0.0 }
      row
    end
  end

  def header
    ["Tätigkeitsbereich ID", "Tätigkeitsbereich"] + services.map(&:name)
  end

  def footer
    ["", "Total"] + services.map do |service|
      ((effort_minutes_by_service[service.id] || 0.0) / 60.0).round 2
    end
  end

  def table
    t = []
    t << header
    t += rows
    t << footer
    t
  end

  def tty
    puts TTY::Table.new rows: rows
  end
end
