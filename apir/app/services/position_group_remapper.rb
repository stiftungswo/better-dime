# frozen_string_literal: true

class PositionGroupRemapper
  # the positions groups are not owned by an offer / project / invoice, so we
  # have to duplicate the groups by hand, then update all positions to use the new groups
  def self.remap_all_groups(position_groupings, positions)
    group_mapping = create_group_mapping(position_groupings) { |_group| true }
    apply_group_mapping(positions, group_mapping)
  end

  # old offers / project / invoices share a lot of position groups,
  # while new ones each have their own separate groups.
  def self.remap_shared_groups(position_groupings, positions)
    group_mapping = create_group_mapping(position_groupings, &:shared)
    apply_group_mapping(positions, group_mapping)
    group_mapping.any?
  end

  # duplicate all groups for which should_duplicate returns true,
  # and return a mapping old_group -> new_group for those groups
  def self.create_group_mapping(position_groupings, &should_duplicate)
    position_groupings.select(&should_duplicate).to_h do |old_group|
      new_group = old_group.dup
      new_group.shared = false
      [old_group, new_group]
    end
  end

  def self.apply_group_mapping(positions, group_mapping)
    positions.each do |position|
      position.position_group = group_mapping[position.position_group] if group_mapping.key?(position.position_group)
    end
  end
end
