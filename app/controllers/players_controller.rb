class PlayersController < Sinatra::Base
  # ... configs ...
  configure do
    set :views, "app/views"
    set :public_dir, "public"
  end

  # GET /players - Agora busca na tabela USERS (role: participant)
  get '/players' do
    content_type :json
    # Busca apenas quem não é admin/organizador (opcional)
    users = User.where(role: 'participant') 
    
    # Se não tiver ninguém, retorna lista vazia
    if users.empty?
      return [].to_json
    end
    
    users.to_json(except: :password_digest) # Não envia a senha no JSON!
  end

  # POST /players - Cria um novo User
  post '/players' do
    content_type :json
    data = JSON.parse(request.body.read)
    
    # Adaptação: O front envia 'category', o User aceita.
    # Mas precisamos gerar uma senha padrão se não vier no request
    user = User.new(
      name: data['name'],
      email: data['email'],
      category: data['category'],
      gender: data['gender'],
      password: "123456", # Senha padrão para cadastros rápidos
      role: 'participant'
    )

    if user.save
      status 201
      user.to_json(except: :password_digest)
    else
      status 422
      { errors: user.errors.full_messages }.to_json
    end
  end
  
  options "*" do
    response.headers["Allow"] = "GET, PUT, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token"
    response.headers["Access-Control-Allow-Origin"] = "*"
    200
  end
end