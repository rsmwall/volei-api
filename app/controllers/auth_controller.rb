class AuthController < Sinatra::Base
  configure do
    enable :cross_origin
  end

  before do
    content_type :json
    response.headers['Access-Control-Allow-Origin'] = '*'
  end

  # CORREÇÃO: Adicionamos '/auth' antes de register
  post '/auth/register' do
    puts "--> Recebi tentativa de cadastro!" # Log para debug
    data = JSON.parse(request.body.read)
    
    user = User.new(
      name: data['name'],
      email: data['email'],
      password: data['password'],
      role: 'participant' 
    )

    if user.save
      status 201
      { message: "User created successfully", user_id: user.id }.to_json
    else
      status 422
      { errors: user.errors.full_messages }.to_json
    end
  end

  # CORREÇÃO: Adicionamos '/auth' antes de login
  post '/auth/login' do
    puts "--> Recebi tentativa de login!" # Log para debug
    data = JSON.parse(request.body.read)
    user = User.find_by(email: data['email'])

    if user && user.authenticate(data['password'])
      status 200
      { 
        token: "fake-jwt-token-#{user.id}", 
        user: { id: user.id, name: user.name, email: user.email } 
      }.to_json
    else
      status 401
      { error: "Credenciais inválidas" }.to_json
    end
  end

  options "*" do
    response.headers["Allow"] = "GET, PUT, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token"
    response.headers["Access-Control-Allow-Origin"] = "*"
    200
  end
end