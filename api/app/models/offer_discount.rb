# frozen_string_literal: true

class OfferDiscount < ApplicationRecord
  belongs_to :offer

  validates :name, :percentage, :value, presence: true
  validates :name, length: { maximum: 255 }
  validates :value, numericality: { greater_than: 0 }
end
