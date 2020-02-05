# frozen_string_literal: true

module V2
  class CustomerTagsController < APIController
    def index
      @q = CustomerTag.order(created_at: :desc).ransack(search_params)
      @customer_tags = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def show
      @customer_tag = CustomerTag.includes(work_periods: [:customer_tag]).find(params[:id]).decorate
    end

    def create
      @customer_tag = CustomerTag.new(customer_tag_params.except(:id))

      respond_to do |format|
        if @customer_tag.save
          format.json { render :show, status: :ok }
        else
          format.json { render json: @customer_tag.errors, status: :unprocessable_entity }
        end
      end
    end

    def update
      @customer_tag = CustomerTag.find(params[:id])

      respond_to do |format|
        if @customer_tag.update(customer_tag_params)
          format.json { render :show, status: :ok }
        else
          format.json { render json: @customer_tag.errors, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @customer_tag = CustomerTag.find(params[:id])

      respond_to do |format|
        if @customer_tag.destroy
          format.json { render :show, status: :ok }
        else
          format.json { render json: @customer_tag.errors, status: :unprocessable_entity }
        end
      end
    end

    # this api could easily be done in #update
    def archive
      @customer_tag = CustomerTag.find(params[:id])

      respond_to do |format|
        if @customer_tag.update(archived: params[:archived])
          format.json { render :show, status: :ok }
        else
          format.json { render json: @customer_tag.errors, status: :unprocessable_entity }
        end
      end
    end

    private

    def customer_tag_params
      params.require(:customer_tag)
      params.require(:customer_tag).permit(:id, :name)
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir, :showArchived, :filterSearch, :page, :pageSize)
    end

    # Also map the old params to new ransack params till the frontend is adapted
    def search_params
      search = params.fetch(:q, {})
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:archived_false] = true if ["false", false, nil].include?(params[:showArchived])
      search[:id_or_name_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :archived_false, :id_or_name_cont)
    end
  end
end
