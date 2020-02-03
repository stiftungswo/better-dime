# frozen_string_literal: true

class GlobalSetting < ApplicationRecord
  validates :sender_name, :sender_street, :sender_zip,
            :sender_phone, :sender_city, :sender_mail,
            :sender_vat, :sender_bank, :sender_web,
            :service_order_comment, :sender_bank_detail,
            :sender_bank_bic, :sender_bank_iban,
            presence: true
end
