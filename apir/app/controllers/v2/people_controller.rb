# frozen_string_literal: true

module V2
  class PeopleController < APIController
    def index
      @q = Person.left_outer_joins(:company, :addresses, :phones).includes(:phones, :addresses, :company).order(created_at: :desc).ransack(search_params)
      @people = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize]).distinct
    end

    def show
      @person = Person.includes(:company, :addresses, :phones).find(params[:id]).decorate
    end

    def create
      @person = Person.new(person_params.except(:id))

      respond_to do |format|
        if @person.save
          format.json { render :show, status: :ok }
        else
          format.json { render json: @person.errors, status: :unprocessable_entity }
        end
      end
    end

    def update
      @person = Person.find(params[:id])
      @person.phones.where.not(id: person_params[:phones_attributes].map { |phone| phone[:id] }).discard_all
      @person.addresses.where.not(id: person_params[:addresses_attributes].map { |address| address[:id] }).discard_all

      respond_to do |format|
        if @person.update(person_params)
          format.json { render :show, status: :ok }
        else
          format.json { render json: @person.errors, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @person = Person.find(params[:id])

      respond_to do |format|
        if @person.destroy
          format.json { render :show, status: :ok }
        else
          format.json { render json: @person.errors, status: :unprocessable_entity }
        end
      end
    end

    # this api could easily be done in #update
    def archive
      @person = Person.find(params[:id])

      respond_to do |format|
        if @person.update(archived: params[:archived])
          format.json { render :show, status: :ok }
        else
          format.json { render json: @person.errors, status: :unprocessable_entity }
        end
      end
    end

    def duplicate
      @person = Person.find(params[:id]).dup.duplicated

      respond_to do |format|
        if @person.save
          format.json { render :show, status: :ok }
        else
          format.json { render json: @person.errors, status: :unprocessable_entity }
        end
      end
    end

    private

    def person_params
      params.require(:person)
      params[:person][:phones_attributes] = params[:phone_numbers]
      params[:person][:addresses_attributes] = params[:addresses]
      params.require(:person).permit(:id, :type, :comment, :company_id, :department, :email, :first_name, :last_name, :hidden, :name, :rate_group_id, :salutation,
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
      search[:id_or_first_name_or_last_name_or_email_or_company_name_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :archived_false, :id_or_first_name_or_last_name_or_email_or_company_name_cont)
    end
  end
end
