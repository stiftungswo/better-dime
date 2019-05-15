# frozen_string_literal: true

class ProjectComment < ApplicationRecord
  belongs_to :project
end
