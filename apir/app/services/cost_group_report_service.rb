# frozen_string_literal: true

class CostGroupReportService
  attr_accessor :daterange
  attr_accessor :employees, :project_efforts, :project_positions, :effort_minutes, :effort_minutes_by_cost_group, :cost_groups

  def initialize(daterange = (Date.today.beginning_of_year..Date.today.end_of_year), employee_group_name: "SWO Angestellte")
    self.daterange = daterange
    self.project_positions = ProjectPosition.joins(:rate_unit, project: :costgroups, project_efforts: { employee: :employee_group }).where("rate_units.is_time" => true, "project_efforts.date" => daterange).where("employee_groups.name" => employee_group_name)
    self.employees = Employee.where(id: project_positions.select("employees.id")).order(first_name: :asc, last_name: :asc)
    self.cost_groups = Costgroup.where(number: project_positions.select("costgroups.number")).order(number: :asc, name: :asc)
    self.effort_minutes = project_positions.group("employees.id", "costgroups.number").sum("project_efforts.value")
    self.effort_minutes_by_cost_group = project_positions.group("costgroups.number").sum("project_efforts.value")
  end

  def effort
    @effort = {}
    effort_minutes.each do |(employee_id, cost_group_id), minutes|
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
    ["Total"] + cost_groups.map do |employee|
      ((effort_minutes_by_cost_group[employee.id] || 0.0) / 60.0).round 2
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
    puts TTY::Table.new rows: table
  end
end
