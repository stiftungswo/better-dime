# frozen_string_literal: true

class GlobalSetting < ApplicationRecord
  validates :sender_name, :sender_street, :sender_zip,
            :sender_phone, :sender_city, :sender_mail,
            :sender_vat, :sender_bank, :sender_web,
            :service_order_comment, :sender_bank_detail,
            :sender_bank_bic, :sender_bank_iban,
            presence: true

  validate :is_the_only_one

  def is_the_only_one
    errors.add(:id, :unique, message: "There can only be one GlobalSetting, somehow you managed to create a new one.") if GlobalSetting.where.not(id: id).any?
  end
end
