# frozen_string_literal: true

module V2
  class APIController < ApplicationController
    include V2::Concerns::ParamsExtractableEmployeeLocale
    include V2::Concerns::ParamsAuthenticatable

    before_action :activate, unless: -> { request.format.pdf? || request.format.xlsx? || request.format.text? }
    before_action :authenticate_from_params!, if: -> { request.format.pdf? || request.format.xlsx? || request.format.text? }

    helper ApplicationHelper
    helper Ransack::Helpers::FormHelper
    helper Kaminari::Helpers

    around_action :switch_locale

    def activate
      authenticate_employee!
    end

    def user_for_paper_trail
      current_employee.nil? ? nil : current_employee.id\
    end

    def switch_locale(&action)
      locale = locale_params[:locale]

      locale = current_employee.try(:locale) if locale.blank?

      locale = extract_locale_from_params_employee if locale.blank? && params[:token]

      locale = I18n.default_locale if locale.blank?

      I18n.with_locale(locale, &action)
    end

    def locale_params
      params.permit(:locale)
    end
  end
end
