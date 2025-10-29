class MatchRequestCreationService
  def self.call(request_params)
    unless PlayerQueryService.find_by_id(request_params['player_id'])
      return { success: false, errors: ["Player not found"] }
    end

    unless MatchQueryService.find_by_id(request_params['match_id'])
      return { success: false, errors: ["Match not found"] }
    end

    request = MatchRequest.new(request_params)

    if request.save
      return { success: true, request: request }
    else
      return { success: false, errors: request.errors.full_messages }
    end
  end
end