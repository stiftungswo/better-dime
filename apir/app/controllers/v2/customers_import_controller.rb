# frozen_string_literal: true

module V2
  class CustomersImportController < APIController
    def template
    end

    def verify
      @customers = CustomersXlsxImportService.new(path: import_verify_params.path).customers
    end

    def create
      CustomersImportService.new(import_params: import_params.map(&:to_h)).create_customers
      render plain: "ok"
    end


    private

    def import_params
      params.permit(customers_to_import: [:type, :comment, :company_id, :department, :email, :first_name,
        :last_name, :hidden, :name, :rate_group_id, :salutation,
        :main_number, :mobile_number, :fax, :city, :country, :description, :zip, :street, :supplement
        ])[:customers_to_import] || []
    end

    def import_verify_params
      params.permit(:importFile)[:importFile]
    end
  end
end
