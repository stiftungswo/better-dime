# frozen_string_literal: true

require "rails_helper"

RSpec.describe ProjectCategory, type: :model do
  it { is_expected.to validate_presence_of :name }

  describe "relations" do
    it "#project_category_distributions" do
      expect(described_class.new).to have_many(:project_category_distributions)
        .dependent(:restrict_with_exception)
    end

    it "#projects" do
      expect(described_class.new).to have_many(:projects)
        .through(:project_category_distributions)
        .dependent(:restrict_with_exception)
    end
  end
end
