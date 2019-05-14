# frozen_string_literal: true

class RateGroup < ApplicationRecord
  has_many :service_rates, dependent: :restrict_with_exception

  validates :name, :description, presence: true
end
