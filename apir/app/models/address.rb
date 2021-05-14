# frozen_string_literal: true

class Address < ApplicationRecord
  include SoftDeletable
  belongs_to :customer, optional: true
  belongs_to :employee, optional: true

  has_many :offers, dependent: :restrict_with_exception
  has_many :projects, dependent: :restrict_with_exception

  validates :zip, :city, :street, presence: true
  validates :zip, numericality: { greater_than_or_equal_to: 1000, only_integer: true }
  validates :hidden, inclusion: [true, false]

  def supplement
    self[:supplement] || ""
  end

  def self.params
    attribute_names.map(&:to_sym) - [:created_at, :updated_at, :deleted_at]
  end
end
