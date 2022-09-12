# frozen_string_literal: true

class PositionGroupUpdater
  def self.update_all(params)
    return unless params

    params.each { |param| update_one(param) }
  end

  def self.update_one(param)
    PositionGroup.where(id: param[:id], shared: false).update_all(name: param[:name], order: param[:order])
  end
end
