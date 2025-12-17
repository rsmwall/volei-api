require 'sinatra/base'
require 'active_record'
require 'json'
require 'yaml'
require 'dotenv/load' if ENV['RACK_ENV'] != 'production'
require 'rack/cors'
require './app/controllers/auth_controller'

# configuraçao do active record
db_config_file = File.read('config/database.yml')
db_config_erb = ERB.new(db_config_file).result
db_config = YAML.safe_load(db_config_erb, aliases: true)

ActiveRecord::Base.establish_connection(db_config[ENV['RACK_ENV'] || 'development'])

# carregar models, services e controllers
Dir[File.join(File.dirname(__FILE__), 'app', '**', '*.rb')].each { |file| require file }

class VoleiApi < Sinatra::Base
  # configuracao
  configure do
    set :bind, '0.0.0.0'
    set :port, 4567 # porta padrao do sinatra
    set :show_exceptions, false
  end

  # Configure o CORS para aceitar requisições do Frontend
  use Rack::Cors do
    allow do
      origins '*'
      resource '*', headers: :any, methods: [:get, :post, :patch, :put, :delete, :options]
    end
  end

  use RegistrationsController
  use PlayersController
  use MatchesController
  use RatingsController
  use AuthController
  use FriendshipsController
  use ReviewsController

  # middleware de erro
  error do
    content_type :json
    status 500
    { error: env['sinatra.error'].message }.to_json
  end

  # rota de teste
  get '/' do
    content_type :json
    { message: 'Vôlei API está no ar!' }.to_json
  end
end

# iniciando a aplicacao
if app_file = $0
   VoleiApi.run!
end
