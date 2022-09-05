# frozen_string_literal: true

module V2
  module Concerns
    module ParamsExtractableEmployeeLocale
      AUD_HEADER = Warden::JWTAuth.config.aud_header.upcase.tr("-", "_").freeze
      AUD_FIELD = ENV.fetch("HTTP_#{AUD_HEADER}", nil)

      def extract_locale_from_params_employee
        employee = Warden::JWTAuth::UserDecoder.new.call(token, :employee, AUD_FIELD)
        employee.try(:locale)
      rescue JWT::DecodeError
      end

      private

      def token
        params.require(:token)
      end
    end
  end
end
