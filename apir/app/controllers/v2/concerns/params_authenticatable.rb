# frozen_string_literal: true

module V2
  module Concerns
    module ParamsAuthenticatable
      AUD_HEADER = Warden::JWTAuth.config.aud_header.upcase.tr("-", "_").freeze
      AUD_FIELD = ENV.fetch("HTTP_#{AUD_HEADER}", nil)

      def authenticate_from_params!
        employee = Warden::JWTAuth::UserDecoder.new.call(token, :employee, AUD_FIELD)
        sign_in :employee, employee
      rescue JWT::DecodeError
        raise AuthorizationError
      end

      private

      def token
        params.require(:token)
      end
    end
  end
end
