# frozen_string_literal: true

class Costgroup < ApplicationRecord
  include SoftDeletable

  has_many :project_costgroup_distributions, foreign_key: :costgroup_number, dependent: :restrict_with_exception
  has_many :invoice_costgroup_distributions, foreign_key: :costgroup_number, dependent: :restrict_with_exception
  has_many :projects, through: :project_costgroup_distributions, dependent: :restrict_with_exception

  validates :number, :name, presence: true
  validates :number, uniqueness: true

  self.primary_key = :number
end
