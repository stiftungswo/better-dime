# frozen_string_literal: true

ERROR_FORMAT = ValidatesTimeliness::Validator::DEFAULT_ERROR_VALUE_FORMATS[:datetime]

RSpec.shared_examples_for 'ending is after beginning' do
  describe '#ending' do
    subject { described_class.new(beginning: beginning, ending: ending).tap(&:validate) }

    let(:beginning) { Time.zone.today }
    let(:formatted_beginning) { beginning.strftime(ERROR_FORMAT) }
    let(:added_error) { subject.errors.added?(:ending, :on_or_after, restriction: formatted_beginning) }

    context 'when ending is before beginning' do
      let(:ending) { beginning - 1.day }

      it 'is invalid' do
        expect(added_error).to eq true
      end
    end

    context 'when ending is after beginning' do
      let(:ending) { beginning + 1.day }

      it 'is valid' do
        expect(added_error).to eq false
      end
    end

    context 'when ending is equal beginning' do
      let(:ending) { beginning }

      it 'is valid' do
        expect(added_error).to eq false
      end
    end
  end
end

RSpec.shared_examples_for 'only accepts dates' do |attribute|
  subject { described_class.new(attribute => value).tap(&:validate) }

  let(:added_error) { subject.errors.added?(attribute, :invalid_date, restriction: nil) }

  context 'when it receives a date' do
    let(:value) { Time.zone.today }

    it 'is valid' do
      expect(added_error).to eq false
    end
  end

  context 'when it receives a string' do
    let(:value) { 'invalid' }

    it 'is invalid' do
      expect(added_error).to eq true
    end
  end

  context 'when it receives an integer' do
    let(:value) { '28454' }

    it 'is invalid' do
      expect(added_error).to eq true
    end
  end

  context 'when it receives a boolean' do
    let(:value) { 'true' }

    it 'is invalid' do
      expect(added_error).to eq true
    end
  end
end
