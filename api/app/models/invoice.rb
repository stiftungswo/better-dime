# frozen_string_literal: true

class Invoice < ApplicationRecord
  belongs_to :accountant, class_name: 'Employee' # TODO: add employee reference
  belongs_to :customer
  belongs_to :address
  belongs_to :project

  has_many :invoice_discounts, dependent: :destroy
end
