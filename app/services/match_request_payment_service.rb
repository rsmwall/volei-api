class MatchRequestPaymentService
  def self.call(request_id)
    request = MatchRequest.find_by(id: request_id)

    return { success: false, not_found: true } unless request

    # atualizar o pagamento para 'paid'
    if request.update(payment_status: 'paid')
      return { success: true, request: request }
    else
      return { success: false, errors: request.errors.full_messages }
    end
  end
end