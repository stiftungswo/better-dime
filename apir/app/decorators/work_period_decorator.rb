# frozen_string_literal: true

class WorkPeriodDecorator < ApplicationDecorator
  delegate_all

  def effective_time
    object.effective_time.round
  end

  def effort_till_today
    object.effort_till_today.round
  end

  def vacation_takeover
    object.vacation_takeover.round
  end

  def period_vacation_budget
    object.period_vacation_budget.round
  end

  def remaining_vacation_budget
    object.remaining_vacation_budget.round
  end

  # Define presentation-specific methods here. Helpers are accessed through
  # `helpers` (aka `h`). You can override attributes, for example:
  #
  #   def created_at
  #     helpers.content_tag :span, class: 'time' do
  #       object.created_at.strftime("%a %m/%d/%y")
  #     end
  #   end
end
