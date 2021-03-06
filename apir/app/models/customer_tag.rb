# frozen_string_literal: true

class CustomerTag < ApplicationRecord
  include SoftDeletable
  has_and_belongs_to_many :customers, join_table: :customer_taggable, autosave: true

  validates :name, presence: true
  validates :name, uniqueness: { case_sensitive: false }
end
