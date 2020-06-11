# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
  before_validation :normalize_unicode

  # https://github.com/stiftungswo/better-dime/issues/277
  def normalize_unicode
    attributes.each do |name, value|
      if value.respond_to? "unicode_normalize"
        self[name] = value.unicode_normalize
      end
    end
    self
  end

  def self.inherited(subclass)
    super

    subclass.ransacker :id, type: :string do
      Arel.sql("#{subclass.table_name}.`id`")
    end
  end
end
