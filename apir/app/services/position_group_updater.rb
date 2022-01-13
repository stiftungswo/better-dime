# frozen_string_literal: true

class PositionGroupUpdater
  def self.update_all(params)
    if not params then return end
    params.each do |param| update_one(param) end
  end

  def self.update_one(param)
    PositionGroup.where(id: param[:id], shared: false).update_all(name: param[:name], order: param[:order])
  end
end
