# frozen_string_literal: true

class ApplicationController < ActionController::API
  include ActionController::MimeResponds

  before_action :set_paper_trail_whodunnit

  respond_to :json

  rescue_from ValidationError do |e|
    render json: e.to_h, status: :unprocessable_content
  end
end
