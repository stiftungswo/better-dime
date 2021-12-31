# frozen_string_literal: true

class PositionGroupRemapper
  # the positions groups are not owned by an offer / project / invoice, so we
  # have to duplicate the groups by hand, then update all positions to use the new groups
  def self.remap_position_groups(position_groupings, positions)
    group_mapping = create_group_mapping(position_groupings)
    
    for position in positions do 
      position.position_group = group_mapping[position.position_group]
    end
  end

  private
  
  def self.create_group_mapping(position_groupings)
    group_mapping = Hash[position_groupings.map do |old_group|
      new_group = old_group.dup
      [old_group, new_group]
    end]
    # deal with the default group
    group_mapping[nil] = nil
    group_mapping
  end
end
