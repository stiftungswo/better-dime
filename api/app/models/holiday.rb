class Holiday < ApplicationRecord
  validates :date, :duration, :name, presence: true
end
