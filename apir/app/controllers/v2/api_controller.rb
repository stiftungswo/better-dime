# frozen_string_literal: true

module V2
  class APIController < ApplicationController
    helper ApplicationHelper
    helper Ransack::Helpers::FormHelper
    helper Kaminari::Helpers
  end
end
