# frozen_string_literal: true

class WorkPeriod < ApplicationRecord
  belongs_to :employee

  validates :employee, :ending, :beginning, :pensum, :yearly_vacation_budget, presence: true
  validates :pensum, :yearly_vacation_budget, numericality: { greater_than: 0 }
end
