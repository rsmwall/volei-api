class PlayerRankingService
  # cálculo de média e ordena os jogadores
  def self.calculate
    # Agregação SQL:
    # - junta (LEFT JOIN) a tabela players com ratings onde Player.id = Rated.id
    # - agrupa (GROUP BY) pelo ID do jogador
    # - calcula a média (AVG) da coluna score
    
    ranking_data = Player
      .left_joins(:rated_ratings)
      .group('players.id')
      .select('players.id, players.name, players.email, AVG(ratings.score) AS average_score')
      .order('average_score DESC NULLS LAST')
      
    ranking_data.map do |player|
      {
        id: player.id,
        name: player.name,
        email: player.email,
        average_score: player.average_score.nil? ? nil : player.average_score.to_f.round(2) 
      }
    end
  end
end