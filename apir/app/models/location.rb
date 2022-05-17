# frozen_string_literal: true

# a buisness location, used in the date / location / signature field.
class Location < ApplicationRecord
  validates :name, presence: true
  validates :url, format: { with: /\A[a-zA-Z]{0,20}\z/, message: "only 0-20 letters" }
  validates :order, presence: true
end
