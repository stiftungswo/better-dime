# frozen_string_literal: true

class CostGroupReportService
  attr_accessor :daterange, :employees, :projects, :project_efforts, :project_positions, :efforts_by_project, :effort_minutes_weighted, :cost_groups

  def initialize(daterange = Date.today.all_year, employee_group_name: "SWO Angestellte")
    self.daterange = daterange
    self.project_positions = ProjectPosition.joins(:project, :rate_unit, project: :costgroups, project_efforts: { employee: :employee_group })
                                            .where("rate_units.is_time" => true, "project_efforts.date" => daterange)
                                            .where("employee_groups.name" => employee_group_name)
    # .where(:project => Project.where(vacation_project: 0)) Uncomment if vacation projects should not be considered
    self.projects = Project.where(id: project_positions.select("project_id"))
    self.employees = Employee.where(id: project_positions.select("employees.id")).order(first_name: :asc, last_name: :asc)
    self.cost_groups = Costgroup.where(number: project_positions.select("costgroups.number")).order(number: :asc, name: :asc)
    self.efforts_by_project = project_positions.group("employees.id", "costgroups.number", "project_id").sum("project_efforts.value")
    self.effort_minutes_weighted = weighted_effort_minutes
  end

  def weighted_effort_minutes
    effort_minutes = {}
    efforts_by_project.each do |(employee_id, cost_group_id, project_id), minutes|
      project = projects.find { |project| project.id == project_id }

      total_weight = 0.0

      project.project_costgroup_distributions.each do |d|
        total_weight += d.weight
      end

      total_weight = 1.0 if total_weight.zero?

      weight = project.project_costgroup_distributions.find do |cg|
        cg.costgroup_number == cost_group_id
      end.weight / total_weight

      effort_minutes[[employee_id, cost_group_id]] ||= 0
      effort_minutes[[employee_id, cost_group_id]] += minutes * weight
    end
    effort_minutes
  end

  def effort
    @effort = {}

    effort_minutes_weighted.each do |(employee_id, cost_group_id), minutes|
      @effort[employee_id] ||= {}
      @effort[employee_id][cost_group_id] = minutes
    end
    @effort.transform_keys! do |employee_id|
      employees.find { |employee| employee.id == employee_id } || Employee.new(first_name: "Unbekannt", last_name: "")
    end
    @effort.transform_values! do |cost_group_efforts|
      cost_group_efforts.transform_keys! do |cost_group_id|
        cost_groups.find { |cost_group| cost_group.number == cost_group_id } || Costgroup.new(name: "???", number: 0)
      end
      cost_group_efforts.transform_values! do |minutes|
        (minutes / 60.0).round(2)
      end
      cost_group_efforts
    end
    @effort
  end

  def rows
    effort.map do |employee, cost_group_effort|
      row = [employee.name]
      row += cost_groups.map { |cost_group| cost_group_effort[cost_group] || 0.0 }
      row
    end
  end

  def header
    ["Name"] + cost_groups.map { |costgroup| [costgroup.number, costgroup.name, "Stunden"].reject(&:blank?).join(", ") }
  end

  def footer
    effort_minutes_by_cost_group = {}
    effort_minutes_weighted.each do |(_employee_id, cost_group_id), minutes|
      effort_minutes_by_cost_group[cost_group_id] ||= 0
      effort_minutes_by_cost_group[cost_group_id] += minutes
    end

    ["Total"] + cost_groups.map do |cost_group|
      ((effort_minutes_by_cost_group[cost_group.id] || 0.0) / 60.0).round 2
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
    Rails.logger.debug TTY::Table.new rows: table
  end
end
