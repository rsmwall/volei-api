class ReviewsController < Sinatra::Base
  configure do
    enable :cross_origin
  end

  before do
    content_type :json
    response.headers['Access-Control-Allow-Origin'] = '*'
  end

  # GET /events/:id/reviews - Listar avaliações de um evento
  get '/events/:id/reviews' do
    # Busca reviews e inclui o nome do autor
    reviews = Review.where(event_id: params[:id]).includes(:user)
    
    reviews.map { |r| 
      r.as_json.merge(user_name: r.user.name) 
    }.to_json
  end

  # POST /reviews - Criar avaliação
  post '/reviews' do
    data = JSON.parse(request.body.read)
    
    review = Review.new(
      user_id: data['user_id'],
      event_id: data['event_id'],
      score: data['score'],
      comment: data['comment']
    )

    if review.save
      status 201
      review.to_json
    else
      status 422
      { errors: review.errors.full_messages }.to_json
    end
  end

  options "*" do
    response.headers["Allow"] = "GET, PUT, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token"
    response.headers["Access-Control-Allow-Origin"] = "*"
    200
  end
end