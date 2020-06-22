# frozen_string_literal: true

class Company < Customer
  has_many :people,
           class_name: "Person",
           inverse_of: :company,
           dependent: :restrict_with_exception

  validates :name, :rate_group, presence: true
  validates :name, uniqueness: { case_sensitive: false }
  validates :email, length: { maximum: 255 }

  def full_name
    name
  end
end
