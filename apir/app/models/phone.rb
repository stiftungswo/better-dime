# frozen_string_literal: true

class Phone < ApplicationRecord
  include SoftDeletable
  belongs_to :customer

  validates :category, :number, presence: true

  before_save :format_number

  def format_number
    case number&.gsub(" ","")
    when /\A0\d{9}\z/
      self.number = number.gsub(" ","").scan(/(\d{3})(\d{3})(\d\d)(\d\d)/).flatten.join(" ")
    when /\A(00|\+)\d{11}\z/
      self.number = number.gsub(" ","").scan(/(00|\+\d\d)(\d\d)(\d{3})(\d\d)(\d\d)/).flatten.join(" ")
    end
  end
end
