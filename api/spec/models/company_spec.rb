# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Company, type: :model do
  it { is_expected.to have_many(:people).class_name('Person').inverse_of(:company).dependent(:restrict_with_exception) }

  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_presence_of :rate_group }
  it { is_expected.to validate_uniqueness_of :name }
  it { is_expected.to validate_length_of(:email).is_at_most(255) }

end
