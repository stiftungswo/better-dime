# frozen_string_literal: true

require "rails_helper"

RSpec.describe CommentMover do
  describe ".move" do
    let(:project_a) { create(:project) }
    let(:project_b) { create(:project) }

    it "moves comments to the target project" do
      comment1 = create(:project_comment, project: project_a)
      comment2 = create(:project_comment, project: project_a)

      described_class.move(comment_ids: [comment1.id, comment2.id], project_id: project_b.id)

      expect(comment1.reload.project).to eq(project_b)
      expect(comment2.reload.project).to eq(project_b)
    end

    it "raises ValidationError on save failure" do
      comment = create(:project_comment, project: project_a)
      allow_any_instance_of(ProjectComment).to receive(:save).and_return(false)
      allow_any_instance_of(ProjectComment).to receive(:errors).and_return(double(messages: { base: ["error"] }, full_messages: ["error"]))

      expect do
        described_class.move(comment_ids: [comment.id], project_id: project_b.id)
      end.to raise_error(ValidationError)
    end
  end
end
