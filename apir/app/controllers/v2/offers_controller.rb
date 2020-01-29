module V2
  class OffersController < APIController
    before_action :set_offer, only: %i[show update destroy]

    def index
      @q = Offer.order(id: :desc).ransack(search_params)
      @offers = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def show
      @offer
    end

    def update
      # destroy offer positions which were not passed along to the params
      destroy_missing(:positions, @offer.offer_positions)
      # destroy discounts which were not passed along to the params
      destroy_missing(:discounts, @offer.offer_discounts)

      raise ValidationError, @offer.errors unless @offer.update(update_params)

      render :show
    end

    def create
      @offer = Offer.new(update_params)

      raise ValidationError, @offer.errors unless @offer.save

      render :show
    end

    private

    def set_offer
      @offer = Offer.find(params[:id])
    end

    def destroy_missing(key, collection)
      unless params[key].blank?
        # destroy items which were not passed along in the params
        collection.each do |item|
          unless params[key].any? {|search_item| search_item[:id] == item.id }
            params[key].push({ id: item.id, _destroy: 1 })
          end
        end
      end
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir, :filterSearch, :page, :pageSize)
    end

    def search_params
      search = params.fetch(:q, {}).permit!
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:id_or_name_or_description_or_short_description_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :id_or_name_or_description_or_short_description_cont)
    end

    def update_params
      params[:offer_positions_attributes] = params[:positions]
      params[:offer_discounts_attributes] = params[:discounts]
      params.permit(
        :accountant_id, :address_id, :customer_id, :description, :fixed_price,
        :fixed_price_vat, :name, :rate_group_id, :short_description, :status,
        offer_positions_attributes: [
          :id, :amount, :vat, :price_per_rate, :description, :order, :position_group_id, :service_id, :rate_unit_id, :_destroy
        ],
        offer_discounts_attributes: [
          :id, :name, :percentage, :value, :_destroy
        ]
      )
    end
  end
end
