# frozen_string_literal: true

class Customer < ApplicationRecord
  belongs_to :rate_group

  # rubocop:disable Rails/HasAndBelongsToMany
  has_and_belongs_to_many :customer_tags, :join_table => :customer_taggable, autosave: true
  # rubocop:enable Rails/HasAndBelongsToMany

  has_many :phones, dependent: :destroy
  has_many :offers, dependent: :restrict_with_exception
  has_many :projects, dependent: :restrict_with_exception

  validates :type, inclusion: %w[Person Company]

  alias phone_numbers phones
end
