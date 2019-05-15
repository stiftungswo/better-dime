# frozen_string_literal: true

class Address < ApplicationRecord
  belongs_to :customer

  has_many :offers, dependent: :restrict_with_exception
  has_many :projects, dependent: :restrict_with_exception

  validates :zip, :city, :street, presence: true
  validates :zip, numericality: { greater_than_or_equal_to: 1000, only_integer: true }
end
