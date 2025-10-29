class MatchQueryService
  def self.find_by_id(id)
    Match.find_by(id: id)
  end

  # metodo para listar todas as partidas
  def self.all
    Match.all
  end
end