# frozen_string_literal: true

module V2
  class APIController < ApplicationController
    before_action :authenticate_user! unless Rails.env.development?
    helper ApplicationHelper
    helper Ransack::Helpers::FormHelper
    helper Kaminari::Helpers
  end
end
