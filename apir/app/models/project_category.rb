# frozen_string_literal: true

class ProjectCategory < ApplicationRecord
  include SoftDeletable
  has_many :projects, foreign_key: :category_id, dependent: :restrict_with_exception

  validates :name, presence: true
end
