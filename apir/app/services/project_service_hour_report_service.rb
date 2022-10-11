# frozen_string_literal: true

# :nocov:
class ProjectServiceHourReportService
  attr_accessor :range, :projects, :project_efforts, :project_positions, :services, :effort_minutes, :effort_minutes_by_service

  def initialize(range = Date.today.all_year)
    self.range = range
    self.project_positions = ProjectPosition.joins(:project_efforts, :rate_unit, :service)
                                            .where("rate_units.is_time" => true, "project_efforts.date" => range)
    self.projects = Project.where(id: project_positions.select("projects.id"))
    self.services = Service.where(id: project_positions.select("services.id")).order(name: :asc)
    self.effort_minutes = project_positions.group("project_id", "services.id").sum("project_efforts.value")
    self.effort_minutes_by_service = project_positions.group("services.id").sum("project_efforts.value")
  end

  def effort
    @effort = {}
    effort_minutes.each do |(project_id, service_id), minutes|
      @effort[project_id] ||= {}
      @effort[project_id][service_id] = minutes
    end
    @effort.transform_keys! do |project_id|
      projects.find { |project| project.id == project_id } || Project.new(name: "Projekte ohne Tätigkeitsbereich")
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
    effort.map do |project, service_effort|
      names = project.project_categories.map(&:name)
      project.project_categories.map do |category|
        if project.project_categories.length > 1 then category.name << (" (#{((project.project_category_distributions.find do |i|
                                                                                 i.category_id == category.id
                                                                               end.weight.to_f / project.project_category_distributions.sum(&:weight)) * 100).round }%)")
        end
      end
      row = [project.id || 0, project.name, project.project_categories&.ids&.join(", "), names.join(", ")]
      row += services.map { |service| service_effort[service] || 0.0 }
      row
    end
  end

  def header
    ["Projekt ID", "Projekt", "Tätigkeitsbereich IDs", "Tätigkeitsbereiche"] + services.map(&:name)
  end

  def footer
    ["", "", "", "Total"] + services.map do |service|
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

  # some love for console developers
  def tty
    Rails.logger.debug TTY::Table.new rows: rows
  end
end
# :nocov:
