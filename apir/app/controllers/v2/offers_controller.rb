module V2
  class OffersController < APIController
    def index
      @offers = Offer.all
    end

    def show
      @offer = Offer.find(params[:id])
    end
  end
end
