# frozen_string_literal: true

class Service < ApplicationRecord
  has_many :service_rates, dependent: :restrict_with_exception
end
