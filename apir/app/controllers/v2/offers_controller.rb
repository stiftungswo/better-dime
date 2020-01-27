module V2
  class OffersController < APIController
    def index
      @q = Offer.order(id: :desc).ransack(search_params)
      @offers = @q.result.page(params[:page]).per(params[:pageSize])
    end

    def show
      @offer = Offer.find(params[:id])
    end

    def search_params
      search = params.fetch(:q, {}).permit!
      search[:s] ||= "#{params[:orderByTag]} #{params[:orderByDir]}"
      search[:id_or_name_or_description_or_short_description] ||= params[:filterSearch]
      search
    end
  end
end
