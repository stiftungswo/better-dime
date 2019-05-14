# frozen_string_literal: true

class Service < ApplicationRecord
  has_many :service_rates, dependent: :restrict_with_exception
  has_many :offer_positions, dependent: :restrict_with_exception
  has_many :project_positions, dependent: :restrict_with_exception
end
