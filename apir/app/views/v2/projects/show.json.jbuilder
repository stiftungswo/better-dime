# frozen_string_literal: true

json.partial! "v2/projects/project", project: @project.decorate, calculate_costgroup_distributions: @calculate_costgroup_distributions
