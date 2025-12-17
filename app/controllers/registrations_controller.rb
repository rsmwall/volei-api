class RegistrationsController < Sinatra::Base
  configure do
    enable :cross_origin
  end

  before do
    content_type :json
    response.headers['Access-Control-Allow-Origin'] = '*'
  end

  # GET /events/:id/participants - ATUALIZADA
  get '/events/:id/participants' do
    event = Event.find(params[:id])
    # Agora retornamos também o ID da inscrição e o status do checkin
    participants = event.registrations.includes(:user).map do |reg|
      {
        registration_id: reg.id,
        user_id: reg.user.id,
        name: reg.user.name,
        email: reg.user.email,
        checkins_count: reg.checkins_count,
        status: reg.status
      }
    end
    participants.to_json
  end

  # PUT /registrations/:id/checkin - Realizar Check-in
  put '/registrations/:id/checkin' do
    reg = Registration.find(params[:id])
    
    # Incrementa contador e marca como compareceu
    reg.checkins_count += 1
    reg.status = 'attended' 
    
    if reg.save
      { message: "Check-in realizado!", checkins: reg.checkins_count }.to_json
    else
      status 422
      { error: "Erro ao fazer check-in" }.to_json
    end
  end

  # GET /registrations/my
  get '/registrations/my' do
    user_id = params['user_id']
    registrations = Registration.where(user_id: user_id).includes(:event)
    
    registrations.map { |reg| 
      # Mescla dados do evento com o ID da inscrição (registration_id)
      reg.event.as_json.merge(
        registration_id: reg.id, # <--- IMPORTANTE: O ID DO TICKET
        registration_status: reg.status
      ) 
    }.to_json
  end

  # GET /registrations/:id - Detalhes de UM ingresso (para a tela de Ticket)
  get '/registrations/:id' do
    # Busca a inscrição e carrega os dados do evento e do usuário
    registration = Registration.includes(:event, :user).find(params[:id])
    
    # Monta o JSON com tudo que o ingresso precisa
    {
      id: registration.id,
      status: registration.status,
      user_name: registration.user.name,
      user_email: registration.user.email,
      event_title: registration.event.title,
      event_date: registration.event.date,
      event_location: registration.event.location,
      event_price: registration.event.price
    }.to_json
  end

  # DELETE /registrations/cancel - Cancelar inscrição
  post '/registrations/cancel' do # Usando POST para facilitar envio de JSON body, mas ideal seria DELETE
    data = JSON.parse(request.body.read)
    reg = Registration.find_by(user_id: data['user_id'], event_id: data['event_id'])
    
    if reg
      reg.destroy
      { message: "Inscrição cancelada com sucesso." }.to_json
    else
      status 404
      { error: "Inscrição não encontrada." }.to_json
    end
  end

  # POST /registrations - Criar inscrição
  post '/registrations' do
    data = JSON.parse(request.body.read)
    event = Event.find(data['event_id'])
    
    # --- DEBUG GRITANTE ---
    puts "========================================"
    puts "EVENTO: #{event.title}"
    puts "PREÇO NO BANCO: #{event.price.inspect}"
    puts "CLASSE DO PREÇO: #{event.price.class}"
    puts "É PAGO? (Logica): #{event.price.to_f > 0}"
    puts "========================================"
    # ----------------------

    # Lógica: Se preço > 0, é pago
    is_paid_event = event.price.to_f > 0
    
    initial_status = is_paid_event ? 'pending' : 'confirmed'
    initial_payment = is_paid_event ? 'pending' : 'completed'

    registration = Registration.new(
      user_id: data['user_id'],
      event_id: data['event_id'],
      status: initial_status,
      payment_status: initial_payment,
      checkins_count: 0
    )

    if registration.save
      status 201
      # O segredo está aqui: enviar 'requires_payment' para o front
      response_data = registration.as_json.merge(requires_payment: is_paid_event)
      
      puts "Resposta enviada: #{response_data}" # DEBUG
      response_data.to_json
    else
      status 422
      { errors: registration.errors.full_messages }.to_json
    end
  end

  # PUT /registrations/:id/pay - Simular confirmação de pagamento
  put '/registrations/:id/pay' do
    reg = Registration.find(params[:id])
    
    if reg.update(status: 'confirmed', payment_status: 'completed')
      { message: "Pagamento confirmado!", status: 'confirmed' }.to_json
    else
      status 422
      { error: "Erro ao processar pagamento" }.to_json
    end
  end
  
  options "*" do
    response.headers["Allow"] = "GET, PUT, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token"
    response.headers["Access-Control-Allow-Origin"] = "*"
    200
  end
end