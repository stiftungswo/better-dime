# frozen_string_literal: true

class Person < Customer
  belongs_to :company, class_name: "Company", optional: true, inverse_of: :people

  validates :first_name, :last_name, :rate_group, presence: true
  validates :email, length: { maximum: 255 }

  def full_name
    "#{first_name} #{last_name}"
  end
end
