# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Application" do
  it "eager loads without errors" do
    expect { Rails.application.eager_load! }.not_to raise_error
  end
end
