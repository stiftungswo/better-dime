# frozen_string_literal: true

# a buisness location, used in the date / location / signature field.
class Location < ApplicationRecord
  validates :name, :url, presence: true
end
