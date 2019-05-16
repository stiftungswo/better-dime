# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ProjectComment, type: :model do
  it { is_expected.to validate_presence_of :comment }
  it { is_expected.to validate_presence_of :date }
  it { is_expected.to belong_to :project }

  describe '#date' do
    it_behaves_like 'only accepts dates', :date
  end
end
