class PlayerCreationService
  # dados do controller
  def self.call(player_params)
    # - tenta criar o novo player
    player = Player.new(player_params)

    if player.save
      # - sucesso
      return { success: true, player: player }
    else
      # - falha
      return { success: false, errors: player.errors.full_messages }
    end
  end
end