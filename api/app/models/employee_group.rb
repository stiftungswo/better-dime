# frozen_string_literal: true

class EmployeeGroup < ApplicationRecord
  has_many :employees, dependent: :restrict_with_exception
end
