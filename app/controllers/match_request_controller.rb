require 'sinatra/base'

class MatchRequestController < Sinatra::Base
  set :root, File.expand_path('../../', __dir__)

  before do
    content_type :json
  end

  # Endpoint: POST /match_requests (Solicitar Adesão)
  # Request Body: { "player_id": "integer", "match_id": "integer" }
  post '/match_requests' do
    request.body.rewind
    params = JSON.parse(request.body.read)

    result = MatchRequestCreationService.call(params)

    if result[:success]
      status 201
      result[:request].to_json(only: [:id, :player_id, :match_id, :status])
    else
      status 422 # Unprocessable Entity
      { errors: result[:errors] }.to_json
    end
  rescue JSON::ParserError
    status 400 # Bad Request
    { error: "Invalid JSON format" }.to_json
  rescue ActiveRecord::RecordNotUnique # captura o erro do DB
    status 422 # Unprocessable Entity
    { errors: ["Player already requested this match."] }.to_json
  end

  # Endpoint: PATCH /match_requests/{id}/accept (Aceitar Adesão)
  patch '/match_requests/:id/accept' do
    result = MatchRequestAcceptanceService.call(params[:id])

    if result[:success]
      status 200 # Success 200 OK
      # Response Body
      result[:request].to_json(only: [:id, :player_id, :match_id, :status])
    elsif result[:not_found]
      status 404 # Not Found
      { error: "Match request not found." }.to_json
    else
      status 422 # Unprocessable Entity (Erro de validação)
      { errors: result[:errors] }.to_json
    end
  end

  # Endpoint: PATCH /match_requests/{id}/reject (Rejeitar Adesão)
  patch '/match_requests/:id/reject' do
    result = MatchRequestRejectionService.call(params[:id])

    if result[:success]
      status 200 # Success 200 OK
      # Response Body
      result[:request].to_json(only: [:id, :player_id, :match_id, :status])
    elsif result[:not_found]
      status 404 # Not Found
      { error: "Match request not found." }.to_json
    else
      status 422 # Unprocessable Entity (Erro de validação)
      { errors: result[:errors] }.to_json
    end
  end

  # Endpoint: PATCH /match_requests/{id}/withdraw (Desistir de Partida)
  patch '/match_requests/:id/withdraw' do
    result = MatchRequestWithdrawalService.call(params[:id])

    if result[:success]
      status 200 # Success 200 OK
      # Response Body: Retorna o status 'withdrawn'
      result[:request].to_json(only: [:id, :player_id, :match_id, :status])
    elsif result[:not_found]
      status 404 # Not Found
      { error: "Match request not found." }.to_json
    else
      status 422 # Unprocessable Entity (Erro de validação)
      { errors: result[:errors] }.to_json
    end
  end
end