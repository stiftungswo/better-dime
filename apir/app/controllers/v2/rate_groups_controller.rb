# frozen_string_literal: true

module V2
  class RateGroupsController < ApplicationController
    before_action :authenticate_employee!

    def index
      @rate_groups = RateGroup.all
    end
  end
end
