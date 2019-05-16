# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Customer, type: :model do
  it { is_expected.to belong_to :rate_group }
  it { is_expected.to have_and_belong_to_many(:customer_tags).autosave(true) }

  it { is_expected.to have_many(:phones).dependent(:destroy) }
  it { is_expected.to have_many(:offers).dependent(:restrict_with_exception) }
  it { is_expected.to have_many(:projects).dependent(:restrict_with_exception) }

  it { is_expected.to validate_inclusion_of(:type).in_array(%w[Person Company]) }
end
