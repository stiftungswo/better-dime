module V2
  class OffersController < APIController
    def index
      @q = Offer.order(id: :desc).ransack(search_params)
      @offers = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def show
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
  end
end
