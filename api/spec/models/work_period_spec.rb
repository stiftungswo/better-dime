# frozen_string_literal: true

require 'rails_helper'

RSpec.describe WorkPeriod, type: :model, philipp: true do
  it { is_expected.to validate_presence_of :employee }
  it { is_expected.to validate_presence_of :ending }
  it { is_expected.to validate_presence_of :beginning }
  it { is_expected.to validate_presence_of :pensum }
  it { is_expected.to validate_presence_of :yearly_vacation_budget }

  it { is_expected.to validate_numericality_of(:pensum).is_greater_than 0 }
  it { is_expected.to validate_numericality_of(:yearly_vacation_budget).is_greater_than 0 }
end
