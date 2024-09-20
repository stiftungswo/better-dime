# frozen_string_literal: true

class CostGroupBreakdownService
  def initialize(project, daterange = nil)
    @project_efforts = daterange.nil? ? project.project_efforts : project.project_efforts.where(date: daterange)
  end

  def costgroup_sums
    @costgroup_sums ||= @project_efforts.group_by(&:costgroup_number).transform_values { |pegs| pegs.sum(&:price) }
  end

  def costgroups_sum
    @costgroups_sum ||= costgroup_sums.values.sum
  end

  def costgroup_distribution(costgroup_number)
    return 0.0.to_f if !costgroup_sums.key?(costgroup_number) || costgroups_sum.nil?

    ((costgroup_sums[costgroup_number] / costgroups_sum) * 100).to_f
  end

  def missing_costgroup_distribution
    return 0.0.to_f if !costgroup_dist_incomplete? || costgroups_sum.nil?

    ((costgroup_sums[nil] / costgroups_sum) * 100).to_f
  end

  def costgroup_dist_incomplete?
    costgroup_sums.key?(nil)
  end
end
