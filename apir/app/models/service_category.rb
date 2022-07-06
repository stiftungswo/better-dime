# frozen_string_literal: true

class ServiceCategory < ApplicationRecord
  include SoftDeletable

  has_many :services, dependent: :restrict_with_exception
  
  belongs_to :parent_category, class_name: 'ServiceCategory', optional: true
  has_many :service_categories, foreign_key: :parent_category_id, dependent: :restrict_with_exception

  validates :name, presence: true
  validates :number, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 99, only_integer: true }
  
  def order
    if parent_category.present?
      ## PPnn
      parent_category.number*100 + number
    else
      # we are a parent category -> nn00
      number*100
    end
  end
end
