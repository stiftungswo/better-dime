# frozen_string_literal: true

class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  
# TODO: before_action :set_paper_trail_whodunnit  (https://github.com/paper-trail-gem/paper_trail#1b-installation)

  respond_to :json
end
