# frozen_string_literal: true

class Employee < ApplicationRecord
  belongs_to :employee_group
end
