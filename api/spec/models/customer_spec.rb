require 'rails_helper'

RSpec.describe Customer, type: :model do
  it { is_expected.to belong_to :rate_group }
  it { is_expected.to validate_inclusion_of(:type).in_array(%w[Person Company]) }
end
