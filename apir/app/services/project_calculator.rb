# frozen_string_literal: true

class ProjectCalculator
  # the following two methods are just helpers to increase the api's response speed, no need to test
  # :nocov:
  def self.invoices_counts(projects)
    projects.joins(:invoices).group(:id).count
  end

  def self.positions_counts(projects)
    projects.left_joins(project_positions: :project_efforts).group(:id).sum(:value)
  end
  # :nocov:

  def self.days_since_last_invoice(project)
    (project.last_effort_date - project.last_invoice_date).days / 86_400 unless project.last_effort_date.nil? || project.last_invoice_date.nil?
  end

  def initialize(project)
    @project = project
  end

  def budget_price
    if @project.offer.nil?
      nil
    elsif @project.offer.fixed_price.nil?
      CostBreakdown.new(
        @project.offer.offer_positions,
        @project.offer.offer_discounts,
        final_cost_group_distribution,
        @project.offer.position_groupings,
        @project.offer.fixed_price,
        @project.offer.fixed_price_vat || 0.077
      ).calculate[:total]
    else
      @project.offer.fixed_price
    end
  end

  def final_cost_group_distribution
    @final_cost_group_distribution ||= calculate_final_cost_group_distribution
  end

  def calculate_final_cost_group_distribution
    count = @project.project_costgroup_distributions.count

    costgroups_override = @project.project_costgroup_distributions.to_h do |icd|
      [icd[:costgroup_number], 100 / count]
    end

    cost_group_breakdown.costgroup_sums.to_h { |cg, weight| [cg, costgroups_override[cg] || weight] }
  end

  def cost_group_breakdown
    @cost_group_breakdown ||= CostGroupBreakdownService.new @project
  end

  def budget_time
    if @project.offer.nil?
      nil
    else
      @project.offer.offer_positions.inject(0) { |sum, p| sum + p.estimated_work_hours }
    end
  end

  def current_price
    @project.project_positions.inject(0) { |sum, p| sum + p.charge }
  end

  def current_time
    @project.project_positions.inject(0) do |sum, p|
      if p.rate_unit.nil? || !p.rate_unit.is_time
        sum
      else
        sum + (p.efforts_value * p.rate_unit.factor)
      end
    end
  end
end
