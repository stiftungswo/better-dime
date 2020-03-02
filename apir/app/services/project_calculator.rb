# frozen_string_literal: true

class ProjectCalculator
  def self.invoices_counts(projects)
    projects.joins(:invoices).group(:id).count
  end

  def self.positions_counts(projects)
    projects.left_joins(project_positions: :project_efforts).group(:id).sum(:value)
  end

  def self.days_since_last_invoice(project)
    (project.last_effort_date - project.last_invoice_date).days / 86_400 unless project.last_effort_date.nil? || project.last_invoice_date.nil?
  end

  def initialize(project)
    @project = project
  end

  def budget_price
    if @project.offer.nil?
      nil
    else
      if @project.offer.fixed_price.nil?
        CostBreakdown.new(
          @project.offer.offer_positions,
          @project.offer.offer_discounts,
          @project.offer.position_groupings,
          @project.offer.fixed_price
        ).calculate[:total]
      else
        @project.offer.fixed_price
      end
    end
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
        sum + p.efforts_value * p.rate_unit.factor
      end
    end
  end
end
