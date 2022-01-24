# frozen_string_literal: true

module V2
  class OffersController < APIController
    include V2::Concerns::ParamsAuthenticatable

    before_action :authenticate_employee!, unless: -> { request.format.pdf? }
    before_action :authenticate_from_params!, if: -> { request.format.pdf? }
    before_action :set_offer, only: [:show, :update, :destroy, :create_project, :print]

    def index
      @q = Offer.order(id: :desc).ransack(search_params)
      @offers = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def show
      @offer
    end

    def update
      # destroy offer positions which were not passed along to the params
      ParamsModifier.destroy_missing(params, @offer.offer_positions, :positions)
      # destroy discounts which were not passed along to the params
      ParamsModifier.destroy_missing(params, @offer.offer_discounts, :discounts)

      PositionGroupUpdater.update_all(groupings_params[:position_groupings])

      raise ValidationError, @offer.errors unless @offer.update(update_params)

      # replace shared position groups by new ones to enable modification in the frontend
      if PositionGroupRemapper.remap_shared_groups(@offer.position_groupings, @offer.offer_positions) then
        raise ValidationError, @offer.errors unless @offer.save
      end

      render :show
    end

    def create
      @offer = Offer.new(update_params)

      raise ValidationError, @offer.errors unless @offer.save

      render :show
    end

    def destroy
      raise ValidationError, @offer.errors unless @offer.discard
    end

    def duplicate
      @offer = Offer.find(params[:id]).deep_clone include: [:offer_positions, :offer_discounts]
      # create new position groups
      PositionGroupRemapper.remap_all_groups(@offer.position_groupings, @offer.offer_positions)
      # update any rate units which might be archived (if possible) when
      # duplicating (since we are possibly duplicating old offers)
      RateUnitUpdater.update_rate_units @offer.offer_positions, @offer.rate_group

      raise ValidationError, @offer.errors unless @offer.save

      render :show
    end

    def create_project
      @project = ProjectCreator.create_project_from_offer @offer, params[:costgroup], params[:category]

      raise ValidationError, @project.errors unless @project.save

      render "v2/projects/show"
    end

    def print
      date = params[:date].blank? ? DateTime.now : (DateTime.parse(params[:date]))
      pdf = Pdfs::OfferPdf.new GlobalSetting.first, @offer, date, params[:city]

      respond_to do |format|
        format.pdf do
          send_data pdf.render, type: "application/pdf", disposition: "inline", filename: pdf.filename + ".pdf"
        end
      end
    end

    private

    def set_offer
      @offer = Offer.find(params[:id])
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

    def groupings_params
      params.permit(
        position_groupings: [:id, :name, :order, :shared]
      )
    end

    def update_params
      ParamsModifier.copy_attributes params, :positions, :offer_positions_attributes
      ParamsModifier.copy_attributes params, :discounts, :offer_discounts_attributes

      params.permit(
        :accountant_id, :address_id, :customer_id, :description, :fixed_price,
        :fixed_price_vat, :name, :rate_group_id, :short_description, :status,
        offer_positions_attributes: [:id, :amount, :vat, :price_per_rate, :description, :order, :position_group_id, :service_id, :rate_unit_id, :_destroy],
        offer_discounts_attributes: [:id, :name, :percentage, :value, :_destroy]
      )
    end
    
  end
end
