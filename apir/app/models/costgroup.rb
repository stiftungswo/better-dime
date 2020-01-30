# frozen_string_literal: true

class Costgroup < ApplicationRecord
  has_many :project_cost_group_distributions, dependent: :restrict_with_exception
  has_many :invoice_cost_group_distributions, dependent: :restrict_with_exception
  has_many :projects, through: :project_cost_group_distributions, dependent: :restrict_with_exception

  validates :number, :name, presence: true
  validates :number, uniqueness: true

  self.primary_key = :number
end
