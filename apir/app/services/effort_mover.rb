# frozen_string_literal: true

class EffortMover
  def self.move(params)
    ProjectEffort.transaction do
      efforts = ProjectEffort.left_joins(project_position: [:service]).where(id: params[:effort_ids].split(","))
      target_project = Project.find(params[:project_id])
      project_positions = target_project.project_positions
      to_position = params[:position_id]

      efforts.each do |effort|
        service = effort.project_position.service

        raise StandardError, "Position #{effort.project_position.id} has no service assigned" unless service

        if to_position
          effort.position_id = to_position
        else
          target_position = project_positions.find { |p| p.service == service }

          unless target_position
            target_position = effort.project_position.deep_clone
            target_position.project = target_project
            target_position.position_group = nil

            raise ValidationError, target_position.errors unless target_position.save

            project_positions.push target_position
          end

          effort.project_position = target_position
        end

        raise ValidationError, effort.errors unless effort.save
      end
    end
  end
end
