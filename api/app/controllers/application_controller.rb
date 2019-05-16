# frozen_string_literal: true

class ApplicationController < ActionController::API
  include ActionController::MimeResponds

  before_action :set_paper_trail_whodunnit

  respond_to :json
end
