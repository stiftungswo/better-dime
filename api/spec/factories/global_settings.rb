# frozen_string_literal: true

FactoryBot.define do
  factory :global_setting do
    sender_name { 'MyString' }
    sender_street { 'MyString' }
    sender_zip { '' }
    sender_phone { 'MyString' }
    sender_city { 'MyString' }
    sender_mail { 'MyString' }
    sender_vat { 'MyString' }
    sender_bank { 'MyString' }
    sender_web { 'MyString' }
    service_order_comment { 'MyString' }
    sender_bank_detail { 'MyString' }
    sender_bank_iban { 'MyString' }
    sender_bank_bic { 'MyString' }
  end
end
