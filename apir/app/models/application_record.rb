# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.inherited(subclass)
    super

    subclass.ransacker :id, type: :string do
      Arel.sql("#{subclass.table_name}.`id`")
    end
  end
end
