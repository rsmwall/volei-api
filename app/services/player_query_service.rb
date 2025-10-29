class PlayerQueryService
  def self.find_by_id(id)
    Player.find_by(id: id)
  rescue ActiveRecord::RecordNotFound
    nil
  end
end