# frozen_string_literal: true

class Phone < ApplicationRecord
  belongs_to :customer

  validates :category, :number, presence: true

  enum category: {
    main: 1,
    direct: 2,
    private: 3,
    mobile: 4,
    fax: 5
  }, _suffix: :number
end
