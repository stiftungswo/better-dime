# frozen_string_literal: true

class CustomersImportService
  attr_accessor :import_params, :rate_groups
  def initialize(import_params:)
    self.import_params = import_params
    self.rate_groups = RateGroup.all
  end

  def create_customers
    import_params.map do |import|
      Rails.logger.info import.inspect
      customer = import.select { |key, _| Customer.attribute_names.include?(key) }
      Rails.logger.info customer.inspect
      customer[:rate_group] = rate_groups.find { |rate_group| rate_group.id == import[:rate_group_id] }

      customer[:phones_attributes] = []
      customer[:phones_attributes] << { category: 1, number: import[:main_number] } if import[:main_number]
      customer[:phones_attributes] << { category: 2, number: import[:mobile_number] } if import[:mobile_number]
      customer[:phones_attributes] << { category: 4, number: import[:fax_number] } if import[:fax_number]

      address = import.select { |key, _| Address.attribute_names.include?(key) }
      customer[:addresses_attributes] = [address] if address.any?
      Rails.logger.info customer.inspect
      Customer.create! customer
    end
  end
end
