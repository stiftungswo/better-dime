# frozen_string_literal: true

class Phone < ApplicationRecord
  include SoftDeletable
  belongs_to :customer

  validates :category, :number, presence: true

  before_save :format_number

  def self.params
    attribute_names.map(&:to_sym) - [:created_at, :updated_at, :deleted_at, :created_by, :updated_by, :deleted_by]
  end

  def format_number
    case number&.gsub(" ", "")
    when /\A0\d{9}\z/
      self.number = number.delete(" ").scan(/(\d{3})(\d{3})(\d\d)(\d\d)/).flatten.join(" ")
    when /\A(00|\+)\d{11}\z/
      self.number = number.delete(" ").scan(/(00|\+\d\d)(\d\d)(\d{3})(\d\d)(\d\d)/).flatten.join(" ")
    end
  end

  [[:main, 1], [:mobile, 2], [:fax, 4]].each do |(name, id)|
    define_method "#{name}!" do
      self.category = id
    end
    define_method "#{name}?" do
      category == id
    end
  end
end
