# frozen_string_literal: true

module V2
  class CostgroupsController < ApplicationController
    before_action :authenticate_employee!

    def index
      @costgroups = Costgroup.all
    end
  end
end
