# frozen_string_literal: true

class ProjectPosition < ApplicationRecord
  belongs_to :rate_unit
  belongs_to :service
  belongs_to :project

  has_many :project_efforts, dependent: :restrict_with_exception
  has_one :invoice_position, dependent: :restrict_with_exception
end
