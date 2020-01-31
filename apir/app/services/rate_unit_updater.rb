class RateUnitUpdater
  def self.update_rate_units(positions, rate_group)
    positions.each do |position|
      active_service_rate = position.service.service_rates.find do |s|
        # try and find a rate unit which isn't archived and
        # is compatible with the project's/offer's rate group (and belongs to the given service)
        # we do this incase the current rate unit is archived
        !s.rate_unit.archived && s.rate_group == rate_group
      end
      position.rate_unit = active_service_rate&.rate_unit || position.rate_unit
    end
  end
end
