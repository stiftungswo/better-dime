module V2
  class OffersController < APIController
    before_action :set_offer, only: %i[show update destroy]

    PERMITTED_OFFER_KEYS = %i[
      accountant_id address_id customer_id description fixed_price
      fixed_price_vat name rate_group_id short_description
      status breakdown invoice_ids discounts
    ].freeze

    def index
      @q = Offer.order(id: :desc).ransack(search_params)
      @offers = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def show
      @offer
    end

    def update
      raise ValidationError, @offer.errors unless @offer.update(offer_params)

      render :show
    end

    private

    def set_offer
      @offer = Offer.find(params[:id])
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir,:showArchived,:filterSearch, :page, :pageSize)
    end

    def search_params
      search = params.fetch(:q, {}).permit!
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:id_or_name_or_description_or_short_description_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :id_or_name_or_description_or_short_description_cont)
    end

    def offer_params
      params.permit(*PERMITTED_OFFER_KEYS)
    end
  end
end
