# frozen_string_literal: true

class Holiday < ApplicationRecord
  validates :date, :duration, :name, presence: true
  validates :duration, numericality: { greater_than: 0, only_integer: true }

  validates :date, timeliness: { type: :date }
end
