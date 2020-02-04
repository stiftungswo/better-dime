# frozen_string_literal: true

module V2
  class GlobalSettingsController < APIController
    def index
      @global_setting = GlobalSetting.order(id: :asc).first_or_initialize
    end

    def update
      @global_setting = GlobalSetting.order(id: :asc).first_or_create

      respond_to do |format|
        if @global_setting.update(global_setting_params)
          format.json { render :show, status: :ok }
        else
          format.json { render json: @global_setting.errors, status: :unprocessable_entity }
        end
      end
    end

    private

    def global_setting_params
      params.require(:global_setting).permit(:id, :sender_name, :sender_street, :sender_zip, :sender_city, :sender_phone, :sender_mail, :sender_vat, :sender_bank, :sender_web, :service_order_comment, :sender_bank_detail, :sender_bank_iban, :sender_bank_bic)
    end
  end
end
