require 'sinatra/base'

class RatingController < Sinatra::Base
  set :root, File.expand_path('../../', __dir__)

  before do
    content_type :json
  end

  # Endpoint: POST /ratings (Criar Avaliação)
  # Request Body: { "rater_id": 1, "rated_id": 2, "match_id": 1, "score": 5 }
  post '/ratings' do
    request.body.rewind
    params = JSON.parse(request.body.read)

    result = RatingCreationService.call(params)

    if result[:success]
      status 201 # Success 201 Created
      # Response Body (Success 201 Created)
      result[:rating].to_json(only: [:id, :rater_id, :rated_id, :match_id, :score])
    else
      status 422 # Unprocessable Entity
      { errors: result[:errors] }.to_json
    end
  rescue JSON::ParserError
    status 400 # Bad Request
    { error: "Invalid JSON format" }.to_json
  end
end