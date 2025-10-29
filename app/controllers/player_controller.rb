require 'sinatra/base'

class PlayerController < Sinatra::Base
  # configuracao
  set :root, File.expand_path('../../', __dir__)

  # middleware
  before do
    content_type :json
  end

  # Endpoint: POST /players (Criar jogador)
  # Request Body: { "name": "...", "email": "...", "gender": "...", "category": "..." }
  post '/players' do
    request.body.rewind
    params = JSON.parse(request.body.read)

    result = PlayerCreationService.call(params)

    if result[:success]
      status 201 # Success 201 Created
      # Response Body (Success 201 Created): Retorna os dados do jogador
      result[:player].to_json(only: [:id, :name, :email, :gender, :category])
    else
      status 422 # Unprocessable Entity
      { errors: result[:errors] }.to_json
    end
  rescue JSON::ParserError
    status 400 # Bad Request
    { error: "Invalid JSON Format" }.to_json
  end

  # Endpoint: GET /players/{id} (buscar jogador)
  get '/players/:id' do
    player = PlayerQueryService.find_by_id(params[:id])

    if player
      status 200 # success 200 OK
      # Response body: retorna os dados do jogador
      player.to_json(only: [:id, :name, :email, :gender, :category])
    else
      status 404 # Not Found
      { error: "Player Not Found" }.to_json
    end
  end
end