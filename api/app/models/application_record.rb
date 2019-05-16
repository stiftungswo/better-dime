# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  include Discard::Model
  self.abstract_class = true
  has_paper_trail
end
