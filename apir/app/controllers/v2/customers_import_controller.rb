# frozen_string_literal: true

module V2
  class CustomersImportController < APIController
    before_action :authenticate_employee!

    def template; end

    def verify
      @customers = CustomersXlsxImportService.new(path: import_verify_params.path).customers
    end

    def create
      CustomersImportService.new(import_params: import_params.map(&:to_h)).create_customers
      render plain: "ok"
    end

    private

    def import_params
      params.permit(customers_to_import: Customer.params + Address.params + [:main_number, :mobile_number, :fax])[:customers_to_import] || []
    end

    def import_verify_params
      params.permit(:importFile)[:importFile]
    end
  end
end
