# frozen_string_literal: true

class RateUnit < ApplicationRecord
  has_many :service_rates, dependent: :restrict_with_exception
end
