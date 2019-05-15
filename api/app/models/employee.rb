# frozen_string_literal: true

class Employee < ApplicationRecord
  belongs_to :employee_group

  has_many :work_periods, dependent: :restrict_with_exception, inverse_of: :employee
  has_many :offers, dependent: :restrict_with_exception, inverse_of: :accountant
  has_many :invoices, dependent: :restrict_with_exception, inverse_of: :accountant
  has_many :project_efforts, dependent: :restrict_with_exception
  has_many :projects, dependent: :restrict_with_exception, inverse_of: :accountant
end
