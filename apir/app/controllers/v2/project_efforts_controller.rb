module V2
  class ProjectEffortsController < ApplicationController
    before_action :set_effort, only: %i[show update destroy]

    def index
      @filtered = ProjectEffortFilter.new(params).filter ProjectEffort.left_joins(:employee, project_position: [:service, :project, :rate_unit, :position_group])
      @efforts = @filtered.select("project_efforts.*, projects.id as p_id, projects.name as p_name,
              services.name as s_name, services.id as s_id, employees.first_name as e_first_name,
              employees.last_name as e_last_name, rate_units.factor as rate_unit_factor,
              rate_units.is_time as rate_unit_is_time, rate_units.effort_unit as effort_unit,
              position_groups.name as group_name, project_positions.description as p_desc")
      @ambiguity_count = @filtered.group(:service_id, :project_id)
                .select("project_positions.project_id, project_positions.service_id, COUNT(DISTINCT(IFNULL(project_positions.position_group_id, -1))) as ambi_count")
                .map {|item| [[item.project_id, item.service_id], item.ambi_count]}.to_h
    end

    def show
      @effort
    end

    def update
      raise ValidationError, @effort.errors unless @effort.update(update_params)

      render :show
    end

    def create
      @effort = ProjectEffort.new(update_params)

      raise ValidationError, @effort.errors unless @effort.save

      render :show
    end

    def destroy
      raise ValidationError, @effort.errors unless @effort.discard
    end

    def move
      EffortMover.move params

      render plain: 'Successfully moved timeslices!'
    end

    private

    def set_effort
      @effort = ProjectEffort.find(params[:id])
    end

    def update_params
      params.permit(:date, :value, :employee_id, :position_id)
    end
  end
end
