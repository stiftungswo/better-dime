# frozen_string_literal: true

class Customer < ApplicationRecord
  include SoftDeletable
  belongs_to :rate_group
  has_and_belongs_to_many :customer_tags, join_table: :customer_taggable, autosave: true

  has_many :phones, dependent: :destroy
  has_many :addresses, dependent: :destroy
  has_many :offers, dependent: :restrict_with_exception
  has_many :projects, dependent: :restrict_with_exception

  belongs_to :accountant, class_name: "Employee", foreign_key: "accountant_id", optional: true, inverse_of: :customers
  belongs_to :company, class_name: "Company", foreign_key: :company_id, optional: true, inverse_of: :people
  has_many :people,
           class_name: "Person",
           inverse_of: :company,
           dependent: :restrict_with_exception,
           foreign_key: :company_id

  accepts_nested_attributes_for :phones, :addresses, allow_destroy: true

  validates :type, inclusion: %w[Person Company person company]
  validates :hidden, inclusion: [true, false]
  validates :archived, inclusion: [true, false]

  scope :people, -> { where(type: "person") }
  scope :companies, -> { where(type: "company") }

  before_save :down_case_type

  def self.params
    attribute_names.map(&:to_sym) - [:created_at, :updated_at, :deleted_at]
  end

  alias phone_numbers phones

  def duplicated
    self.name = name + " copy #{rand(3).to_i}" if name
    self.first_name = first_name + " copy #{rand(3).to_i}" if first_name
    self
  end

  def all_addresses
    company ? addresses + company.addresses : addresses
  end

  def full_name
    [first_name, last_name, name].reject(&:blank?).join(" ")
  end

  def is_duplicated?
    Customer.where(name: name, first_name: first_name, last_name: last_name).any?
  end

  def down_case_type
    self.type = type.downcase
  end

  private

  # PHP single table inheritance is inherently incomaptible with rails single table inheritance
  # PHP requires the type content to be lowercase
  # Rails requires the type content to be capitalized
  # For the desired temporary intercompatibility we need to support lower case type names in rails
  # customer.type: company -> rails won't find the class Company
  # customer.type: company -> capitalize -> Company -> rails find the class Company
  # This source code might change on every Rails release. This is a private undocumented rails method.
  # https://github.com/rails/rails/blob/b305f0e206b0d15ea81f9571669d9e831c9193e0/activerecord/lib/active_record/inheritance.rb#L251
  warn "MONKEYPATCH: Customer.find_sti_class <private> might has change since rails '6.0.2.1', please ensure it still works" unless Gem.loaded_specs["rails"].version == "6.0.2.1"
  def self.find_sti_class(type_name)
    type_name = type_name.capitalize
    super
    ## .find_sti_class content as of 6.0.2.1
    # type_name = base_class.type_for_attribute(inheritance_column).cast(type_name)
    # subclass = self.sti_class_for(type_name)

    # unless subclass == self || descendants.include?(subclass)
    #   raise SubclassNotFound, "Invalid single-table inheritance type: #{subclass.name} is not a subclass of #{name}"
    # end

    # subclass
  end
end
