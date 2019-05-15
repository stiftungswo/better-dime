class CustomerTag < ApplicationRecord
  has_and_belongs_to_many :customers

  validates :archived, :name, presence: true
end
