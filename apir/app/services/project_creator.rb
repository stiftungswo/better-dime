# frozen_string_literal: true

class ProjectCreator
  def self.create_project_from_offer(offer)
    project = Project.new
    project.offer = offer
    project.name = offer.name
    project.address = offer.address
    project.customer = offer.customer
    project.accountant = offer.accountant
    project.rate_group = offer.rate_group
    project.fixed_price = offer.fixed_price
    project.description = offer.short_description

    project.project_positions = create_positions_from_offer(project, offer)
    project
  end

  private

  def self.create_positions_from_offer(project, offer)
    offer.offer_positions.map do |position|
      project_position = ProjectPosition.new
      project_position.project = project
      project_position.rate_unit = position.rate_unit
      project_position.service = position.service
      project_position.position_group = position.position_group
      project_position.description = position.description
      project_position.vat = position.vat
      project_position.price_per_rate = position.price_per_rate
      project_position.order = position.order
      project_position
    end || []
  end
end
