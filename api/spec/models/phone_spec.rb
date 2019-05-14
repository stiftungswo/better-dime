# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Phone, type: :model do
  it { is_expected.to validate_presence_of :number }
  it { is_expected.to validate_presence_of :category }
end
