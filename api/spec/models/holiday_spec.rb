require 'rails_helper'

RSpec.describe Holiday, type: :model do
  it { is_expected.to validate_presence_of :duration }
  it { is_expected.to validate_presence_of :date }
  it { is_expected.to validate_presence_of :name }
end
