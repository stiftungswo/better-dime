# frozen_string_literal: true

class RateGroup < ApplicationRecord
  has_many :service_rates, dependent: :restrict_with_exception
  has_many :offers, dependent: :restrict_with_exception
  has_many :projects, dependent: :restrict_with_exception
  has_many :customers, dependent: :restrict_with_exception

  validates :name, :description, presence: true
end
