require 'sinatra/base'

class MatchController < Sinatra::Base
  set :root, File.expand_path('../../', __dir__)

  before do
    content_type :json
  end

  # Endpoint: POST /matches (Criar Partida)
  # Request Body: { "title": "...", "location": "...", "date": "...", "category": "...", "organizer_id": 1 }
  post '/matches' do
    request.body.rewind
    params = JSON.parse(request.body.read)

    result = MatchCreationService.call(params)

    if result[:success]
      status 201 # Success 201 Created
      # Response Body (Success 201 Created): Retorna os dados da partida
      result[:match].to_json(only: [:id, :title, :location, :date, :category, :status, :organizer_id])
    else
      status 422 # Unprocessable Entity
      { errors: result[:errors] }.to_json
    end
  rescue JSON::ParserError
    status 400 # Bad Request
    { error: "Invalid JSON format" }.to_json
  end

  # Endpoint: GET /matches (Listar Partidas)
  get '/matches' do
    matches = MatchQueryService.all

    status 200 # Success 200 OK
    
    # Response Body: Retorna uma array de partidas
    matches.map do |match|
      match.as_json(only: [:id, :title, :location, :date, :category, :status, :organizer_id])
    end.to_json
  end
end