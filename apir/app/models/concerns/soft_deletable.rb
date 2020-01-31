module SoftDeletable
  extend ActiveSupport::Concern
  include Discard::Model

  included do
    self.discard_column = :deleted_at
    default_scope -> { kept }
    has_paper_trail
  end
end
