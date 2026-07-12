# frozen_string_literal: true

RSpec.shared_examples_for "ending is after beginning" do
  describe "#ending" do
    subject { described_class.new(beginning: beginning, ending: ending).tap(&:validate) }

    let(:beginning) { Time.zone.today }
    let(:has_error) { subject.errors.of_kind?(:ending, :on_or_after) }

    context "when ending is before beginning" do
      let(:ending) { beginning - 1.day }

      it "is invalid" do
        expect(has_error).to be true
      end
    end

    context "when ending is after beginning" do
      let(:ending) { beginning + 1.day }

      it "is valid" do
        expect(has_error).to be false
      end
    end

    context "when ending is equal beginning" do
      let(:ending) { beginning }

      it "is valid" do
        expect(has_error).to be false
      end
    end
  end
end

RSpec.shared_examples_for "only accepts dates" do |attribute|
  subject { described_class.new(attribute => value).tap(&:validate) }

  let(:has_error) { subject.errors.of_kind?(attribute, :invalid_date) }

  context "when it receives a date" do
    let(:value) { Time.zone.today }

    it "is valid" do
      expect(has_error).to be false
    end
  end

  context "when it receives a string" do
    let(:value) { "invalid" }

    it "is invalid" do
      expect(has_error).to be true
    end
  end

  context "when it receives an integer" do
    let(:value) { "28454" }

    it "is invalid" do
      expect(has_error).to be true
    end
  end

  context "when it receives a boolean" do
    let(:value) { "true" }

    it "is invalid" do
      expect(has_error).to be true
    end
  end
end
