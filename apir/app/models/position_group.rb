# frozen_string_literal: true

class PositionGroup < ApplicationRecord
  include SoftDeletable

  has_many :project_positions
  has_many :offer_positions
  has_many :invoice_positions
  
  validates :order, numericality: { only_integer: true}, allow_nil: true
  validates :shared, inclusion: [true, false]
end
