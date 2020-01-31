# frozen_string_literal: true

class OfferDiscount < ApplicationRecord
  include SoftDeletable
  belongs_to :offer

  validates :name, :value, presence: true
  validates :name, length: { maximum: 255 }
  validates :value, numericality: { greater_than: 0 }
end
