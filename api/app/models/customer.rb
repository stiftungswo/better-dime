# frozen_string_literal: true

class Customer < ApplicationRecord
  belongs_to :rate_group
  validates :type, inclusion: %w[Person Company]
end
