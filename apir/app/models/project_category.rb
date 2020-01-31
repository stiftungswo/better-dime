# frozen_string_literal: true

class ProjectCategory < ApplicationRecord
  include SoftDeletable
  has_many :projects, dependent: :restrict_with_exception

  validates :name, :archived, presence: true
end
