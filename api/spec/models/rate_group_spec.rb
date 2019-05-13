require 'rails_helper'

RSpec.describe RateGroup, type: :model do
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_presence_of :description }
end
