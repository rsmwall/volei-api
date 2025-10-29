class MatchRequestAcceptanceService
  def self.call(request_id)
    request = MatchRequest.find_by(id: request_id)

    return { success: false, not_found: true } unless request

    # atualizar o status para 'accepted'
    if request.update(status: 'accepted')
      return { success: true, request: request }
    else
      return { success: false, errors: request.errors.full_messages }
    end
  end
end