# frozen_string_literal: true

module V2
  module Concerns
    module ParamsExtractableEmployeeLocale
      AUD_HEADER = Warden::JWTAuth.config.aud_header.upcase.tr('-', '_').freeze
      AUD_FIELD = ENV["HTTP_#{AUD_HEADER}"]

      def extract_locale_from_params_employee
        begin
          employee = Warden::JWTAuth::UserDecoder.new.call(token, :employee, AUD_FIELD)
          employee.try(:locale)
        rescue JWT::DecodeError
        end
      end

      private

      def token
        params.require(:token)
      end
    end
  end
end
