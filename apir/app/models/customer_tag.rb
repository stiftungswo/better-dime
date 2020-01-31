# frozen_string_literal: true

class CustomerTag < ApplicationRecord
  include SoftDeletable
  # rubocop:disable Rails/HasAndBelongsToMany
  has_and_belongs_to_many :customers
  # rubocop:enable Rails/HasAndBelongsToMany

  validates :archived, :name, presence: true
end
