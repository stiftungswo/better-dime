# frozen_string_literal: true

class CustomerXlsxDecorator < ApplicationDecorator
  delegate_all

  def company_name
    object.name || object.company&.name
  end

  def full_name
    [object.first_name, object.last_name].reject(&:blank?).join(" ")
  end

  def addresses
    object.addresses.map do |address|
      [
        [address.street, address.supplement].reject(&:blank?).join(" "),
        [address.zip, address.city].reject(&:blank?).join(" ")
      ]
    end
  end


  def phones
    object.phones.map(&:number).join(", ")
  end

  def comment
    object.comment || object.company&.comment
  end

  def type
    object.type&.titleize
  end
end
