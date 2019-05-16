# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Invoice, type: :model, philipp: true do
  it { is_expected.to validate_presence_of :accountant }
  it { is_expected.to validate_presence_of :address }
  it { is_expected.to validate_presence_of :description }
  it { is_expected.to validate_presence_of :beginning }
  it { is_expected.to validate_presence_of :ending }
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_numericality_of(:fixed_price).only_integer }
  it { is_expected.to validate_numericality_of(:fixed_price_vat).is_greater_than_or_equal_to 0 }

  describe '#ending' do
    subject { build :invoice, beginning: beginning, ending: ending }

    let(:beginning) { Time.zone.today }

    context 'when ending is before beginning' do
      let(:ending) { beginning - 1.day }

      it 'is_invalid' do
        expect(subject.valid?).to eq false
      end
    end

    context 'when ending is after beginning' do
      let(:ending) { beginning + 1.day }

      it 'is_invalid' do
        p subject.tap(&:validate).errors
        expect(subject.valid?).to eq true
      end
    end
  end
  # TODO: Validate timeliness of beginning, ending.
end
