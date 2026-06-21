# frozen_string_literal: true

class AllowlistedJwt < ApplicationRecord
  self.table_name = "whitelisted_jwts"

  belongs_to :employee
end
