# frozen_string_literal: true

module V2
  class CostgroupsController < ApplicationController
    def index
      @costgroups = Costgroup.all
    end
  end
end
