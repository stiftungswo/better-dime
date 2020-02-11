# frozen_string_literal: true

module V2
  class CompaniesController < APIController
    def index
      @q = Company.left_outer_joins(:phones, :addresses, :people).includes(:phones, :addresses, :people).order(created_at: :desc).ransack(search_params)
      @companies = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize]).distinct
    end

    def show
      @company = Company.includes(:phones, :addresses, :people).find(params[:id]).decorate
    end

    def create
      @company = Company.new(company_params.except(:id))

      respond_to do |format|
        if @company.save
          format.json { render :show, status: :ok }
        else
          format.json { render json: @company.errors, status: :unprocessable_entity }
        end
      end
    end

    def update
      @company = Company.find(params[:id])
      @company.phones.where.not(id: company_params[:phones_attributes].map { |phone| phone[:id] }).discard_all
      @company.addresses.where.not(id: company_params[:addresses_attributes].map { |address| address[:id] }).discard_all
      @company.customer_tag_ids = company_params[:customer_tag_ids]

      respond_to do |format|
        if @company.update(company_params)
          format.json { render :show, status: :ok }
        else
          format.json { render json: @company.errors, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @company = Company.find(params[:id])

      respond_to do |format|
        if @company.destroy
          format.json { render :show, status: :ok }
        else
          format.json { render json: @company.errors, status: :unprocessable_entity }
        end
      end
    end

    # this api could easily be done in #update
    def archive
      @company = Company.find(params[:id])

      respond_to do |format|
        if @company.update(archived: params[:archived])
          format.json { render :show, status: :ok }
        else
          format.json { render json: @company.errors, status: :unprocessable_entity }
        end
      end
    end

    def duplicate
      @company = Company.find(params[:id]).dup.duplicated

      respond_to do |format|
        if @company.save
          format.json { render :show, status: :ok }
        else
          format.json { render json: @company.errors, status: :unprocessable_entity }
        end
      end
    end

    private

    def company_params
      params.require(:company)
      params[:company][:phones_attributes] = params[:phone_numbers]
      params[:company][:addresses_attributes] = params[:addresses]
      params[:company][:customer_tag_ids] = params[:tags]
      params.require(:company).permit(:id, :type, :comment, :company_id, :department, :email, :first_name, :last_name, :hidden, :name, :rate_group_id, :salutation, customer_tag_ids: [],
        phones_attributes: [:id, :number, :category, :customer_id], addresses_attributes: [:id, :city, :country, :customer_id, :description, :zip, :street, :supplement])
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir, :showArchived, :filterSearch, :page, :pageSize)
    end

    # Also map the old params to new ransack params till the frontend is adapted
    def search_params
      search = params.fetch(:q, {})
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:archived_false] = true if ["false", false, nil].include?(params[:showArchived])
      search[:companies_tags_id_in] = params[:customer_tags] if legacy_params[:customer_tags]
      search[:id_or_name_or_email_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :archived_false, :id_or_name_or_email_cont, :companies_tags_id_in)
    end
  end
end
