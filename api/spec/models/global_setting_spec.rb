# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GlobalSetting, type: :model do
  it { is_expected.to validate_presence_of :sender_name }
  it { is_expected.to validate_presence_of :sender_street }
  it { is_expected.to validate_presence_of :sender_zip }
  it { is_expected.to validate_presence_of :sender_phone }
  it { is_expected.to validate_presence_of :sender_city }
  it { is_expected.to validate_presence_of :sender_mail }
  it { is_expected.to validate_presence_of :sender_vat }
  it { is_expected.to validate_presence_of :sender_bank }
  it { is_expected.to validate_presence_of :sender_web }
  it { is_expected.to validate_presence_of :service_order_comment }
  it { is_expected.to validate_presence_of :sender_bank_detail }
  it { is_expected.to validate_presence_of :sender_bank_iban }
  it { is_expected.to validate_presence_of :sender_bank_bic }
end
