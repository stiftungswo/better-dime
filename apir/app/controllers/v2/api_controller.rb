# frozen_string_literal: true

module V2
  class APIController < ApplicationController
    include V2::Concerns::ParamsExtractableEmployeeLocale

    before_action :activate, unless: -> { request.format.pdf? }
    before_action :authenticate_from_params!, if: -> { request.format.pdf? }

    helper ApplicationHelper
    helper Ransack::Helpers::FormHelper
    helper Kaminari::Helpers

    around_action :switch_locale

    def activate
      authenticate_employee!
    end

    def switch_locale(&action)
      locale = current_employee.try(:locale)

      if locale.blank? && params[:token]
        locale = extract_locale_from_params_employee
      end

      if locale.blank?
        locale = I18n.default_locale
      end

      I18n.with_locale(locale, &action)
    end
  end
end
