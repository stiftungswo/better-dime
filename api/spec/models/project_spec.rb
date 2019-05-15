# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Project, type: :model do
  it { is_expected.to validate_presence_of :archived }
  it { is_expected.to validate_presence_of :accountant }
  it { is_expected.to validate_presence_of :chargeable }
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_presence_of :address }
  it { is_expected.to validate_presence_of :project_category }
  it { is_expected.to validate_presence_of :rate_group }
  it { is_expected.to validate_numericality_of(:fixed_price).only_integer }

  it { is_expected.to belong_to(:customer) }
  it { is_expected.to belong_to(:address) }
  it { is_expected.to belong_to(:project_category) }
  it { is_expected.to belong_to(:offer) }
  it { is_expected.to belong_to(:rate_group) }

  it 'belongs to an accountant' do
    expect(described_class.new).to belong_to(:accountant)
      .class_name(Employee.to_s)
      .with_foreign_key('accountant_id')
      .inverse_of(:projects)
  end
end
