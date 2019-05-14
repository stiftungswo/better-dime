# frozen_string_literal: true

class Customer < ApplicationRecord
  belongs_to :rate_group
  has_many :phones, dependent: :destroy
  validates :type, inclusion: %w[Person Company]
end
