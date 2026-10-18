# frozen_string_literal: true

module V2
  class InvoicesController < APIController
    include V2::Concerns::ParamsAuthenticatable

    before_action :authenticate_employee!, unless: -> { request.format.pdf? }
    before_action :authenticate_from_params!, if: -> { request.format.pdf? }
    before_action :set_invoice, only: [:show, :update, :update_timespan, :destroy, :print, :print_qr_bill, :effort_report]

    def index
      @q = Invoice.order(id: :desc).ransack(search_params)
      @invoices = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def show
      @invoice
    end

    def create
      @invoice = Invoice.new(update_params)

      raise ValidationError, @invoice.errors unless @invoice.save

      render :show
    end

    def update
      # destroy invoice positions which were not passed along to the params
      ParamsModifier.destroy_missing params, @invoice.invoice_positions, :positions
      # destroy discounts which were not passed along to the params
      ParamsModifier.destroy_missing params, @invoice.invoice_discounts, :discounts
      # destroy costgroup distributions which were not passed along to the params
      ParamsModifier.destroy_missing params, @invoice.invoice_costgroup_distributions, :costgroup_distributions

      PositionGroupUpdater.update_all(groupings_params[:position_groupings])

      raise ValidationError, @invoice.errors unless @invoice.update(update_params)

      # replace shared position groups by new ones to enable modification in the frontend
      raise ValidationError, @invoice.errors if PositionGroupRemapper.remap_shared_groups(@invoice.position_groupings, @invoice.invoice_positions) && !@invoice.save

      render :show
    end

    def update_timespan
      @invoice = InvoiceCreator.update_timespan @invoice, params[:beginning], params[:ending]

      raise ValidationError, @invoice.errors unless @invoice.save

      render :show
    end

    def destroy
      raise ValidationError, @invoice.errors unless @invoice.discard
    end

    def duplicate
      @invoice = Invoice.find(params[:id]).deep_clone(
        include: [:invoice_positions, :invoice_discounts, :invoice_costgroup_distributions]
      )
      # create new position groups
      PositionGroupRemapper.remap_all_groups(@invoice.position_groupings, @invoice.invoice_positions)

      raise ValidationError, @invoice.errors unless @invoice.save

      render :show
    end

    # Both print actions accept `check=1`: they run only the validations (cheap, no rendering) and
    # answer 204, so the frontend can surface errors as in-app messages and then open the real URL
    # for the single actual render - which keeps the Content-Disposition filename.
    def print
      require_costgroups!("Cannot print invoice without assigning cost groups")
      return head :no_content if check_only?

      pdf = Pdfs::InvoicePdf.new GlobalSetting.first, @invoice, print_date

      respond_to do |format|
        format.pdf do
          send_data pdf.render, type: "application/pdf", disposition: "inline", filename: "#{pdf.filename}.pdf"
        end
      end
    end

    def print_qr_bill
      require_costgroups!("Cannot print QR-Bills's for invoices without cost groups")
      Pdfs::InvoiceQrBillPdf.validate!(GlobalSetting.first, @invoice)
      return head :no_content if check_only?

      pdf = Pdfs::InvoiceQrBillPdf.new GlobalSetting.first, @invoice, print_date

      respond_to do |format|
        format.pdf do
          send_data pdf.render, type: "application/pdf", disposition: "inline", filename: "#{pdf.filename}.pdf"
        end
      end
    end

    def effort_report
      pdf = Pdfs::InvoiceEffortReportPdf.new GlobalSetting.first, @invoice, params[:city]

      respond_to do |format|
        format.pdf do
          send_data pdf.render, type: "application/pdf", disposition: "inline", filename: "#{pdf.filename}.pdf"
        end
      end
    end

    private

    def check_only?
      params[:check].present?
    end

    def print_date
      params[:date].blank? ? DateTime.now : DateTime.parse(params[:date])
    end

    def require_costgroups!(message)
      return if @invoice.invoice_costgroup_distributions.present?

      @invoice.errors.add(:invoice_costgroup_distributions, message)

      raise ValidationError, @invoice.errors
    end

    def set_invoice
      @invoice = Invoice.includes({ project: [:project_efforts] }).find(params[:id])
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir, :filterSearch, :page, :pageSize)
    end

    def search_params
      search = params.fetch(:q, {}).permit!
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:id_or_name_or_description_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :id_or_name_or_description_cont)
    end

    def groupings_params
      params.permit(
        position_groupings: [:id, :name, :order, :shared]
      )
    end

    def update_params
      ParamsModifier.copy_attributes params, :positions, :invoice_positions_attributes
      ParamsModifier.copy_attributes params, :discounts, :invoice_discounts_attributes
      ParamsModifier.copy_attributes params, :costgroup_distributions, :invoice_costgroup_distributions_attributes

      params.permit(
        :accountant_id, :address_id, :customer_id, :description, :name, :fixed_price, :fixed_price_vat,
        :location_id, :beginning, :ending, :project_id,
        invoice_positions_attributes: [:id, :vat, :price_per_rate, :rate_unit_id, :amount, :description, :order, :position_group_id, :_destroy],
        invoice_costgroup_distributions_attributes: [:id, :weight, :costgroup_number, :_destroy],
        invoice_discounts_attributes: [:id, :name, :value, :percentage, :_destroy]
      )
    end
  end
end
