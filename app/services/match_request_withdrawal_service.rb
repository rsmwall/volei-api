class MatchRequestWithdrawalService
  def self.call(request_id)
    request = MatchRequest.find_by(id: request_id)

    return { success: false, not_found: true } unless request

    # atualiza o status para 'withdrawn'
    if request.update(status: 'withdrawn')
      return { success: true, request: request }
    else
      return { success: false, errors: request.errors.full_messages }
    end
  end
end