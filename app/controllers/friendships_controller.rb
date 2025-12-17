class FriendshipsController < Sinatra::Base
  configure do
    enable :cross_origin
  end

  before do
    content_type :json
    response.headers['Access-Control-Allow-Origin'] = '*'
  end

  # GET /users_to_add - Lista usuários que NÃO são eu
  get '/users_to_add' do
    current_user_id = params['current_user_id']
    
    # Busca todos exceto o próprio usuário
    # (Num sistema real, filtraríamos também quem já é amigo)
    users = User.where.not(id: current_user_id).select(:id, :name, :email, :photo_url, :city)
    users.to_json
  end

  # POST /friendships - Enviar pedido de amizade
  post '/friendships' do
    data = JSON.parse(request.body.read)
    
    # Evita duplicatas
    existing = Friendship.find_by(requester_id: data['requester_id'], receiver_id: data['receiver_id'])
    if existing
      halt 409, { error: "Pedido já enviado ou já são amigos." }.to_json
    end

    friendship = Friendship.new(
      requester_id: data['requester_id'],
      receiver_id: data['receiver_id'],
      status: 'pending' # Começa pendente
    )

    if friendship.save
      status 201
      { message: "Pedido de amizade enviado!" }.to_json
    else
      status 422
      { errors: friendship.errors.full_messages }.to_json
    end
  end

  # GET /friendships/my - Meus amigos e pedidos
  get '/friendships/my' do
    user_id = params['user_id']
    
    # Busca amizades onde sou o requerente ou o receptor
    friendships = Friendship.where("requester_id = ? OR receiver_id = ?", user_id, user_id)
    
    # Monta uma lista bonitinha com o nome do amigo
    results = friendships.map do |f|
      is_requester = f.requester_id.to_s == user_id.to_s
      friend = is_requester ? User.find(f.receiver_id) : User.find(f.requester_id)
      
      {
        id: f.id,
        friend_name: friend.name,
        friend_email: friend.email,
        status: f.status,
        direction: is_requester ? 'sent' : 'received' # enviei ou recebi?
      }
    end

    results.to_json
  end

  # PUT /friendships/:id - Atualizar status (Aceitar/Rejeitar)
  put '/friendships/:id' do
    data = JSON.parse(request.body.read)
    friendship = Friendship.find(params[:id])
    
    if friendship.update(status: data['status'])
      { message: "Status atualizado para #{data['status']}" }.to_json
    else
      status 422
      { errors: friendship.errors.full_messages }.to_json
    end
  end

  # DELETE /friendships/:id - Remover amigo ou cancelar pedido
  delete '/friendships/:id' do
    friendship = Friendship.find(params[:id])
    if friendship
      friendship.destroy
      { message: "Amizade desfeita." }.to_json
    else
      status 404
      { error: "Amizade não encontrada." }.to_json
    end
  end
  
  options "*" do
    response.headers["Allow"] = "GET, PUT, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token"
    response.headers["Access-Control-Allow-Origin"] = "*"
    200
  end
end