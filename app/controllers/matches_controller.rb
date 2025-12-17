class MatchesController < Sinatra::Base
  configure do
    enable :cross_origin
  end

  before do
    content_type :json
    response.headers['Access-Control-Allow-Origin'] = '*'
  end

  # GET /events - Listar todos os eventos
  get '/events' do
    events = Event.all.order(date: :asc) # Ordena por data
    
    # Inclui os dados do organizador no JSON para mostrar o nome dele no Front
    events.to_json(include: { organizer: { only: [:id, :name] } })
  end

  # POST /events - Criar novo evento
  post '/events' do
    data = JSON.parse(request.body.read)

    # Verifica se o ID do usuário veio (o frontend vai mandar isso)
    if data['user_id'].nil?
      halt 401, { error: "Usuário não identificado. Faça login novamente." }.to_json
    end

    event = Event.new(
      title: data['title'],
      location: data['location'],
      date: data['date'],
      category: data['category'],
      description: data['description'],
      price: data['price'],
      event_type: data['price'].to_f > 0 ? 'paid' : 'free', # Define automático
      user_id: data['user_id'], # ID do organizador vindo do front
      status: 'open'
    )

    if event.save
      status 201
      event.to_json
    else
      status 422
      { errors: event.errors.full_messages }.to_json
    end
  end

  # DELETE /events/:id - Cancelar evento
  delete '/events/:id' do
    event = Event.find(params[:id])
    if event
      event.destroy
      { message: "Evento cancelado" }.to_json
    else
      status 404
      { error: "Evento não encontrado" }.to_json
    end
  end

  # PUT /events/:id - Editar evento
  put '/events/:id' do
    data = JSON.parse(request.body.read)
    event = Event.find(params[:id])
    
    if event.update(
      title: data['title'],
      location: data['location'],
      date: data['date'],
      description: data['description'],
      price: data['price'],
      category: data['category']
    )
      event.to_json
    else
      status 422
      { errors: event.errors.full_messages }.to_json
    end
  end

  options "*" do
    response.headers["Allow"] = "GET, PUT, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token"
    response.headers["Access-Control-Allow-Origin"] = "*"
    200
  end
end