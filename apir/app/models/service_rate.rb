# frozen_string_literal: true

class ServiceRate < ApplicationRecord
  include SoftDeletable
  belongs_to :rate_group
  belongs_to :service
  belongs_to :rate_unit

  validates :value, presence: true
  validates :value, numericality: { greater_than_or_equal_to: 0, only_integer: true }
end
