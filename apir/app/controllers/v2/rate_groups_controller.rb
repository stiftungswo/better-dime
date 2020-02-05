module V2
  class RateGroupsController < ApplicationController
    def index
      @rate_groups = RateGroup.all
    end
  end
end
