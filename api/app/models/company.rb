# frozen_string_literal: true

class Company < Customer
  has_many :people,
           class_name: 'Customer',
           foreign_key: :customers_id,
           inverse_of: :company,
           dependent: :restrict_with_exception

  validates :name, :rate_group, presence: true
end
