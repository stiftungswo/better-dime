# frozen_string_literal: true

class Address < ApplicationRecord
  include SoftDeletable
  belongs_to :customer

  has_many :offers, dependent: :restrict_with_exception
  has_many :projects, dependent: :restrict_with_exception

  validates :zip, :city, :street, presence: true
  validates :zip, numericality: { greater_than_or_equal_to: 1000, only_integer: true }

  def self.params
    self.attribute_names.map(&:to_sym) - [:created_at, :updated_at, :deleted_at, :created_by, :updated_by, :deleted_by]
  end
end
