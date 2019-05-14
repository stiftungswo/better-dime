class ProjectPosition < ApplicationRecord
  belongs_to :rate_unit
  belongs_to :service

  has_many :project_efforts, dependent: :restrict_with_exception
end
