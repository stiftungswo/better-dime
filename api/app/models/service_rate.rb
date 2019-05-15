# frozen_string_literal: true

class ServiceRate < ApplicationRecord
  belongs_to :rate_group
  belongs_to :service
  belongs_to :rate_unit
end
