class OfferPosition < ApplicationRecord
  belongs_to :offer
  belongs_to :rate_unit
  belongs_to :service
end
