# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
  before_validation :normalize_unicode

  # https://github.com/stiftungswo/better-dime/issues/277
  def normalize_unicode
    attributes.each do |name, value|
      self[name] = value.unicode_normalize if value.respond_to?("encoding") && value.encoding == Encoding::UTF_8
    end
    self
  end

  def self.ransackable_attributes(_auth_object = nil)
    authorizable_ransackable_attributes
  end

  def self.ransackable_associations(_auth_object = nil)
    authorizable_ransackable_associations
  end

  def self.inherited(subclass)
    super

    subclass.ransacker :id, type: :string do
      Arel.sql("#{subclass.table_name}.`id`")
    end
  end
end
