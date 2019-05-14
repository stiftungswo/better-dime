# frozen_string_literal: true

class Holiday < ApplicationRecord
  validates :date, :duration, :name, presence: true
end
