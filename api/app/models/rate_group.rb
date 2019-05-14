# frozen_string_literal: true

class RateGroup < ApplicationRecord
  validates :name, :description, presence: true
end
