# frozen_string_literal: true

class Employee < ApplicationRecord
  include Devise::JWT::RevocationStrategies::Whitelist
  include SoftDeletable

  belongs_to :employee_group

  has_many :work_periods, dependent: :restrict_with_exception, inverse_of: :employee
  has_many :offers, dependent: :restrict_with_exception, inverse_of: :accountant
  has_many :invoices, dependent: :restrict_with_exception, inverse_of: :accountant
  has_many :project_efforts, dependent: :restrict_with_exception
  has_many :projects, dependent: :restrict_with_exception, inverse_of: :accountant

  accepts_nested_attributes_for :work_periods, allow_destroy: true

  validates :email, :first_name, :last_name, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :holidays_per_year, numericality: { greater_than_or_equal_to: 0 }
  validates :first_vacation_takeover, numericality: { greater_than_or_equal_to: 0 }

  devise :database_authenticatable, :rememberable, :validatable, :jwt_authenticatable, jwt_revocation_strategy: self

  def encrypted_password
    # for compatibility with previous backend's hash (PHP Laravel with BCrypt, Stretch 10) we replace the hash
    # algorithm prefix with 2a (devise's bcrypt can handle the 2y formatted hash)
    self[:encrypted_password].sub "$2y$", "$2a$"
  end

  def active_for_authentication?
    super && can_login?
  end

  def full_name
    [first_name, last_name].select(&:present?).join(" ")
  end
  alias name full_name

  def duplicate
    duped = dup
    duped.email = duped.email.sub "@", rand(10_000).to_s + "@"
    duped.password = SecureRandom.hex(10)
    duped
  end
end
