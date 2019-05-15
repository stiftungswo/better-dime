# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Person, type: :model do
  it { is_expected.to belong_to(:company).class_name('Company').with_foreign_key(:customers_id).optional().inverse_of(:people) }

  it { is_expected.to validate_presence_of :first_name }
  it { is_expected.to validate_presence_of :last_name }
  it { is_expected.to validate_presence_of :rate_group }
  it { is_expected.to validate_length_of(:email).is_at_most(255) }
end
