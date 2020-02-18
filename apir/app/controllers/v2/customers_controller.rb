# frozen_string_literal: true

module V2
  class CustomersController < APIController
    def index
      @q = Customer.left_outer_joins(:customer_tags, :addresses, :phones,people: [:addresses, :phones], company: [{people: [:addresses, :phones]}]).
        includes(:addresses, :phones, :company).order(created_at: :desc).ransack(search_params)
      @customers = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize]).distinct
    end

    def show
      @customer = Customer.includes(:company, :addresses, :phones, :customer_tags).find(params[:id]).decorate
    end

    def create
      @customer = Customer.new(customer_params.except(:id))

      respond_to do |format|
        if @customer.save
          format.json { render :show, status: :ok }
        else
          format.json { render json: @customer.errors, status: :unprocessable_entity }
        end
      end
    end

    def update
      @customer = Customer.find(params[:id])
      @customer.phones.where.not(id: customer_params[:phones_attributes].map { |phone| phone[:id] }).discard_all
      @customer.addresses.where.not(id: customer_params[:addresses_attributes].map { |address| address[:id] }).discard_all
      @customer.customer_tag_ids = customer_params[:customer_tag_ids]

      respond_to do |format|
        if @customer.update(customer_params)
          format.json { render :show, status: :ok }
        else
          format.json { render json: @customer.errors, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @customer = Customer.find(params[:id])

      respond_to do |format|
        if @customer.destroy
          format.json { render :show, status: :ok }
        else
          format.json { render json: @customer.errors, status: :unprocessable_entity }
        end
      end
    end

    # this api could easily be done in #update
    def archive
      @customer = Customer.find(params[:id])

      respond_to do |format|
        if @customer.update(archived: params[:archived])
          format.json { render :show, status: :ok }
        else
          format.json { render json: @customer.errors, status: :unprocessable_entity }
        end
      end
    end

    def duplicate
      @customer = Customer.find(params[:id]).dup.duplicated

      respond_to do |format|
        if @customer.save
          format.json { render :show, status: :ok }
        else
          format.json { render json: @customer.errors, status: :unprocessable_entity }
        end
      end
    end

    def import
      CustomersImportService.new(import_params: import_params.map(&:to_h)).create_customers
      render plain: "ok"
    end

    def import_verify
      @customers = CustomersXlsxImportService.new(path: import_verify_params.path).customers
    end

    def import_template
    end

    private

    def import_params
      params.permit(customers_to_import: [:type, :comment, :company_id, :department, :email, :first_name,
        :last_name, :hidden, :name, :rate_group_id, :salutation,
        :main_number, :mobile_number, :fax, :city, :country, :description, :zip, :street, :supplement
        ])[:customers_to_import] || []
    end

    def import_verify_params
      params.permit(:importFile)[:importFile]
    end

    def customer_params
      params[:customer] ||= params[:person]
      params[:customer] ||= params[:company]
      params.require(:customer)
      params[:customer][:phones_attributes] = params[:phone_numbers]
      params[:customer][:addresses_attributes] = params[:addresses]
      params[:customer][:customer_tag_ids] = params[:tags]
      params.require(:customer).permit(:id, :type, :comment, :company_id, :department, :email, :first_name, :last_name, :hidden, :name, :rate_group_id, :salutation, customer_tag_ids: [],
        phones_attributes: [:id, :number, :category, :customer_id], addresses_attributes: [:id, :city, :country, :customer_id, :description, :zip, :street, :supplement])
    end

    def legacy_params
      params[:showArchived] = params[:include_hidden] if params[:include_hidden]
      params.permit(:orderByTag, :orderByDir, :showArchived, :filterSearch, :page, :pageSize, :format, :include_hidden, :customer_tags)
    end

    # Also map the old params to new ransack params till the frontend is adapted
    def search_params
      search = params.fetch(:q, {})
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:archived_false] = true if ["false", false, nil].include?(legacy_params[:showArchived])
      search[:customer_tags_id_in] = params[:customer_tags] if legacy_params[:customer_tags]
      search[:id_or_first_name_or_last_name_or_email_or_company_name_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :archived_false, :id_or_first_name_or_last_name_or_email_or_company_name_cont, :customer_tags_id_in)
    end
  end
end
