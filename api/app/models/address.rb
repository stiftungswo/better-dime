class Address < ApplicationRecord
  belongs_to :customer

  validates :zip, :city, :street, presence: true
  validates :zip, numericality: { greater_than_or_equal_to: 1000, only_integer: true }
end
