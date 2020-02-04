# frozen_string_literal: true

require "rails_helper"

RSpec.describe EmployeeGroup, type: :model do
  it { is_expected.to have_many(:employees).dependent(:restrict_with_exception) }

  it { is_expected.to validate_presence_of :name }
end
