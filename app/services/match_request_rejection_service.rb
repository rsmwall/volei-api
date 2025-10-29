class MatchRequestRejectionService
  def self.call(request_id)
    request = MatchRequest.find_by(id: request_id)

    return { success: false, not_found: true } unless request

    # atualizar o status para 'rejected'
    if request.update(status: 'rejected')
      return { success: true, request: request }
    else
      return { success: false, errors: request.errors.full_messages }
    end
  end
end