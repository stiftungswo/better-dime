# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  include Discard::Model
  self.abstract_class = true
  has_paper_trail

  def self.inherited(subclass)
    super

    subclass.ransacker :id, type: :string do
      Arel.sql("#{subclass.table_name}.`id`")
    end
  end
end
