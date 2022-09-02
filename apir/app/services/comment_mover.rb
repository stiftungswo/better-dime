# frozen_string_literal: true

class CommentMover
  def self.move(params)
    ProjectComment.transaction do
      comments = ProjectComment.find(params[:comment_ids])
      target_project = Project.find(params[:project_id])

      comments.each do |comment|
        comment.project = target_project

        raise ValidationError, comment.errors unless comment.save
      end
    end
  end
end
