module V2
  class InvoicesController < ApplicationController
    before_action :set_invoice, only: %i[show update destroy]

    def index
      @q = Invoice.order(id: :desc).ransack(search_params)
      @invoices = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def show
      @invoice
    end

    def update
      # destroy invoice positions which were not passed along to the params
      ParamsModifier.destroy_missing params, @invoice.invoice_positions, :positions
      # destroy discounts which were not passed along to the params
      ParamsModifier.destroy_missing params, @invoice.invoice_discounts, :discounts
      # destroy costgroup distributions which were not passed along to the params
      ParamsModifier.destroy_missing params, @invoice.invoice_costgroup_distributions, :costgroup_distributions

      raise ValidationError, @invoice.errors unless @invoice.update(update_params)

      render :show
    end

    def create
      @invoice = Invoice.new(update_params)

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

      raise ValidationError, @invoice.errors unless @invoice.save

      render :show
    end

    private

    def set_invoice
      @invoice = Invoice.find(params[:id])
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir,:filterSearch, :page, :pageSize)
    end

    def search_params
      search = params.fetch(:q, {}).permit!
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:id_or_name_or_description_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :id_or_name_or_description_cont)
    end

    def update_params
      ParamsModifier.copy_attributes params,:positions, :invoice_positions_attributes
      ParamsModifier.copy_attributes params,:discounts, :invoice_discounts_attributes
      ParamsModifier.copy_attributes params,:costgroup_distributions, :invoice_costgroup_distributions_attributes

      params.permit(
        :accountant_id, :address_id, :customer_id, :description, :name, :rate_group_id,
        :deadline, :chargeable, :vacation_project, :fixed_price, :category_id,
        invoice_positions_attributes: [
          :id, :vat, :price_per_rate, :rate_unit_id, :service_id,
          :description, :order, :position_group_id, :_destroy
        ],
        invoice_costgroup_distributions_attributes: [
          :id, :weight, :costgroup_number, :_destroy
        ],
        invoice_discounts_attributes: [
          :id, :name, :value, :percentage, :_destroy
        ]
      )
    end
  end
end
