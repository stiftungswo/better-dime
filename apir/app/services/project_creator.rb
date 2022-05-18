# frozen_string_literal: true

class ProjectCreator
  def self.create_project_from_offer(offer, costgroup, category)
    project = Project.new
    project.offer = offer
    project.name = offer.name
    project.address = offer.address
    project.customer = offer.customer
    project.accountant = offer.accountant
    project.rate_group = offer.rate_group
    project.fixed_price = offer.fixed_price
    project.description = offer.short_description
    project.location_id = offer.location_id
    # new offers should already come with costgroups and categories, but
    # there might be some old offers that use the costgroup and category argument
    project.project_costgroup_distributions = create_costgroups_from_offer(project, offer) || create_costgroups(project, costgroup)
    project.project_category_distributions = create_categories_from_offer(project, offer) || create_categories(project, category)

    project.project_positions = create_positions_from_offer(project, offer)
    project
  end

  private

  def self.create_categories(project, category)
    raise ValidationError, "project is missing a category" if category == nil
    project_category = ProjectCategoryDistribution.new
    project_category.project = project
    project_category.project_category = ProjectCategory.find_by_id(category)
    project_category.weight = 100
    [project_category]
  end

  def self.create_costgroups(project, costgroup)
    raise ValidationError, "project is missing a costgroup" if costgroup == nil
    project_costgroup = ProjectCostgroupDistribution.new
    project_costgroup.project = project
    project_costgroup.costgroup = Costgroup.find_by_number(costgroup)
    project_costgroup.weight = 100
    [project_costgroup]
  end

  def self.create_categories_from_offer(project, offer)
    new_categories = offer.offer_category_distributions.map do |category|
      project_category = ProjectCategoryDistribution.new
      project_category.project = project
      project_category.project_category = category.project_category
      project_category.weight = category.weight
      project_category
    end || []
    # return nil instead of [] to make || work later.
    new_categories.any? ? new_categories : nil
  end

  def self.create_costgroups_from_offer(project, offer)
    new_costgroups = offer.offer_costgroup_distributions.map do |costgroup|
      project_costgroup = ProjectCostgroupDistribution.new
      project_costgroup.project = project
      project_costgroup.costgroup = costgroup.costgroup
      project_costgroup.weight = costgroup.weight
      project_costgroup
    end || []
    # return nil instead of [] to make || work later.
    new_costgroups.any? ? new_costgroups : nil
  end

  def self.create_positions_from_offer(project, offer)
    new_positions = offer.offer_positions.map do |position|
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
    PositionGroupRemapper.remap_all_groups(offer.position_groupings, new_positions)
    new_positions
  end
end
