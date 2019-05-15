# frozen_string_literal: true

class Customer < ApplicationRecord
  belongs_to :rate_group

  has_many :phones, dependent: :destroy
  has_many :offers, dependent: :restrict_with_exception
  has_many :projects, dependent: :restrict_with_exception

  validates :type, inclusion: %w[Person Company]

  alias phone_numbers phones
end
