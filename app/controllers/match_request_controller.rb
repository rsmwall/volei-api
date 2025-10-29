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
end