# frozen_string_literal: true

require 'rails_helper'

RSpec.describe WorkPeriod, type: :model do
  it { is_expected.to belong_to :employee }
  it { is_expected.to validate_presence_of :beginning }
  it { is_expected.to validate_presence_of :ending }
  it { is_expected.to validate_presence_of :pensum }
  it { is_expected.to validate_presence_of :yearly_vacation_budget }
  it { is_expected.to validate_numericality_of(:pensum).only_integer.is_greater_than(0) }

  it_behaves_like 'ending is after beginning'

  describe '#beginning' do
    it_behaves_like 'only accepts dates', :beginning
  end

  describe '#ending' do
    it_behaves_like 'only accepts dates', :ending
  end
end
