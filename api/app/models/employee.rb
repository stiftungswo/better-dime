# frozen_string_literal: true

class Employee < ApplicationRecord
  belongs_to :employee_group

  has_many :work_periods, dependent: :restrict_with_exception, inverse_of: :employee
  has_many :offers, dependent: :restrict_with_exception, inverse_of: :accountant
  has_many :invoices, dependent: :restrict_with_exception, inverse_of: :accountant
  has_many :project_efforts, dependent: :restrict_with_exception
  has_many :projects, dependent: :restrict_with_exception, inverse_of: :accountant

  validates :email, :first_name, :last_name, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :holidays_per_year, numericality: { greater_than_or_equal_to: 0, only_integer: true }
end
