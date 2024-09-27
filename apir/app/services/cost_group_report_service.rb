# frozen_string_literal: true

class CostGroupReportService
  attr_accessor :daterange, :employees, :projects, :project_efforts, :project_positions, :efforts_by_project, :employee_sums, :cost_group_sums, :cost_groups

  def initialize(daterange = Date.today.all_year, employee_group_name: "SWO Angestellte")
    self.daterange = daterange
    self.project_efforts = ProjectEffort.joins(project_position: [:project, :rate_unit], employee: :employee_group)
                                        .where("rate_units.is_time" => true, "project_efforts.date" => daterange)
                                        .where("employee_groups.name" => employee_group_name)
    # .where(:project => Project.where(vacation_project: 0)) Uncomment if vacation projects should not be considered
    self.projects = Project.where(id: project_efforts.select("project_position.project_id"))
    self.employees = Employee.where(id: project_efforts.select("employees.id")).order(first_name: :asc, last_name: :asc) + [Employee.new(first_name: "Unbekannt", last_name: "")]
    self.cost_groups = Costgroup.where(number: project_efforts.select("costgroup_number")).order(number: :asc, name: :asc) + [Costgroup.new(name: "???", number: nil)]
    self.efforts_by_project = project_efforts.group("employees.id", "costgroup_number").sum("value")
    self.employee_sums = project_efforts.group("employees.id").sum("value")
    self.cost_group_sums = project_efforts.group("costgroup_number").sum("value")
  end

  def effort
    @effort ||= efforts_by_project.each_with_object({}) do |(ids, minutes), memo|
      employee_id, costgroup_number = *ids

      employee = employees.find { |employee| employee.id == employee_id } || Employee.new(first_name: "Unbekannt", last_name: "")
      employee_values = memo[employee] || {}

      employee_values[cost_groups.find { |cost_group| cost_group.number == costgroup_number } || Costgroup.new(name: "???", number: nil)] = minutes
      memo[employee] = employee_values

      memo
    end
  end

  def rows
    effort.map do |employee, cost_group_efforts|
      row = [employee.name]
      row += employee_cost_groups_hours(cost_group_efforts)
      row += [(employee_sums[employee.id] / 60.0).round(2)]
      row += employee_cost_groups_percentages(cost_group_efforts, employee)
      row
    end
  end

  def row_style
    [nil] +
      Array.new(cost_groups.size) { nil } +
      [nil] +
      Array.new(cost_groups.size) { @percent }
  end

  def header
    ["Name"] +
      cost_groups.map { |costgroup| [costgroup.number, costgroup.name, "Stunden"].reject(&:blank?).join(", ") } +
      ["Total"] +
      cost_groups.map { |costgroup| [costgroup.number, costgroup.name, "(%)"].reject(&:blank?).join(", ") }
  end

  def footer
    ["Total"] +
      cost_groups.map do |cost_group|
        ((cost_group_sums[cost_group.number] || 0.0) / 60.0).round(2)
      end +
      [((cost_group_sums.values.sum || 0.0) / 60.0).round(2)] +
      cost_groups.map { "" }
  end

  def define_styles(workbook)
    percent(workbook)
  end

  def percent(workbook)
    @percent ||= workbook.styles.add_style(format_code: "0.00%")
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

  private

  def employee_cost_groups_percentages(cost_group_efforts, employee)
    cost_groups.map do |cost_group|
      employee_sum = employee_sums[employee.id]
      cost_group_effort = cost_group_efforts[cost_group]

      next 0.0 if employee_sum.nil? || cost_group_effort.nil?

      (cost_group_effort / employee_sum)
    end
  end

  def employee_cost_groups_hours(cost_group_efforts)
    cost_groups.map { |cost_group| ((cost_group_efforts[cost_group] || 0.0) / 60.0).round(2) }
  end
end
