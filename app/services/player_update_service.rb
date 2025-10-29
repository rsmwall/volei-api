class PlayerUpdateService
  def self.call(id, update_params)
    # - encontrar o jogador
    player = PlayerQueryService.find_by_id(id)

    # - veficar se existe
    return { success: false, not_found: true } unless player

    # - atualizar atributos
    if player.update(update_params)
      # sucesso
      return { success: true, player: player }
    else
      # falha
      return { success: false, errors: player.errors.full_message }
    end
  end
end