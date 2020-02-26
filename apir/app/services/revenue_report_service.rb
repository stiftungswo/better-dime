class RevenueReportService
  attr_accessor :daterange
  attr_accessor :employees, :projects, :project_efforts, :project_positions, :effort_minutes, :effort_minutes_by_cost_group, :cost_groups

  def initialize(daterange = (Date.today.beginning_of_year..Date.today.end_of_year))
    self.daterange = daterange
    self.projects = Project.all
    # self.projects = Project.left_outer_joins(:offer, :costgroups, :project_category, project_positions: [{project_efforts: {employee: :employee_group}}])
    # self.project_positions = ProjectPosition.joins(:rate_unit, project: :costgroups, project_efforts: {employee: :employee_group}).where("project_efforts.date" => daterange).where("employee_groups.name" => employee_group_name)
    # self.employees = Employee.where(id: project_positions.select("employees.id")).order(first_name: :asc, last_name: :asc)
    # self.cost_groups = Costgroup.where(number: project_positions.select("costgroups.number")).order(number: :asc, name: :asc)
    # self.effort_minutes = project_positions.group("employees.id", "costgroups.number").sum("project_efforts.value")
    # self.effort_minutes_by_cost_group = project_positions.group("costgroups.number").sum("project_efforts.value")
  end

  def rows
    projects.map do |project|
      [project.name]
    end
  end

  HEADER = ["Typ", "Name", "Kategorie (Tätigkeitsbereich)", "Auftraggeber", "Start", "Verantwortlicher Mitarbeiter", "Aufwand CHF (Projekt)", "Umsatz CHF (Rechnung)", "Umsatz erwartet CHF (Offerte)"]
  HEADER = [""]
  def header
    HEADER
  end

  def footer
    HEADER.map {""}
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
