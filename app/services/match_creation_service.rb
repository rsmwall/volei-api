class MatchCreationService
  def self.call(match_params)
    # verificar se o organizador existe
    unless PlayerQueryService.find_by_id(match_params['organizer_id'])
      return { success: false, errors: ["Organizer not found"] }
    end

    # nova partida
    match = Match.new(match_params)

    if match.save
      # sucesso
      return { success: true, match: match }
    else
      # falha
      return { success: false, errors: match.errors.full_message }
    end
  end
end
