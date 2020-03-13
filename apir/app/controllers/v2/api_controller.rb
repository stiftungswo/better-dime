# frozen_string_literal: true

module V2
  class APIController < ApplicationController
    include V2::Concerns::ParamsExtractableEmployeeLocale

    before_action :authenticate_employee!, unless: -> { request.format.pdf? }
    before_action :authenticate_from_params!, if: -> { request.format.pdf? }

    helper ApplicationHelper
    helper Ransack::Helpers::FormHelper
    helper Kaminari::Helpers

    around_action :switch_locale

    def switch_locale(&action)
      locale = current_employee.try(:locale) || extract_locale_from_params_employee || I18n.default_locale
      I18n.with_locale(locale, &action)

      puts "Using locale " + locale.to_s
    end
  end
end
