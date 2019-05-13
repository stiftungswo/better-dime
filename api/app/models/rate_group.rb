class RateGroup < ApplicationRecord
  validates :name, :description, presence: true
end
