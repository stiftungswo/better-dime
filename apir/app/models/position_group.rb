class PositionGroup < ApplicationRecord
  include SoftDeletable

  has_many :project_positions
  has_many :offer_positions
  has_many :invoice_positions
end
